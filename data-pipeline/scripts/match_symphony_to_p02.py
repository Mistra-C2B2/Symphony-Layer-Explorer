#!/usr/bin/env python3
"""
Symphony Layers to P02 Parameters 
"""

import json
import os
import requests
import time
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv


class SymphonyP02MatcherV2:
    def __init__(self):
        """Initialize the matcher with API client and data structures."""
        # Load environment variables
        load_dotenv()

        self.api_key = os.getenv(
            'OPEN_ROUTER_API_KEY') or os.getenv('OPEN_ROUTER_KEY')
        if not self.api_key:
            raise ValueError(
                "OPEN_ROUTER_API_KEY or OPEN_ROUTER_KEY not found in environment variables")

        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = "google/gemini-2.5-pro"  # Use larger context model

        # Data storage
        self.symphony_data = []
        self.p02_parameters = {}  # code -> {label, definition}

        # Rate limiting
        self.request_delay = 1  # seconds between requests

        print("Initialized Symphony-P02 Matcher v2 (Recommendations Focus)")

    def load_symphony_metadata(self, file_path: str = "../source-data/symphony_layer_metadata.json") -> None:
        """Load Symphony metadata and extract required fields."""
        print(f"Loading Symphony metadata from {file_path}...")

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                raw_data = json.load(f)

            self.symphony_data = []
            for entry in raw_data:
                # Extract only name and recommendations
                symphony_entry = {
                    'name': entry.get('Name', ''),
                    'recommendations': entry.get('Recommendationsfordataimprovement', ''),
                    'limitations': entry.get('LimitationsforuseinSymphony', ''),
                    'summary': entry.get('Summary', '')
                }

                # Skip the header/schema entry and only include entries with actual layer names
                if (symphony_entry['name'] and
                    not symphony_entry['name'].startswith('The title of the data') and
                        len(symphony_entry['name']) < 100):  # Real layer names are short
                    self.symphony_data.append(symphony_entry)

            print(f"Loaded {len(self.symphony_data)} Symphony entries")

        except FileNotFoundError:
            print(f"Error: {file_path} not found")
            raise
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON from {file_path}: {e}")
            raise

    def load_p02_parameters(self, file_path: str = "../source-data/p02.jsonld") -> None:
        """Load P02 parameters and extract codes, labels, and definitions."""
        print(f"Loading P02 parameters from {file_path}...")

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            self.p02_parameters = {}

            # Parse the @graph array
            if '@graph' in data:
                for entry in data['@graph']:
                    # Extract parameter code from identifier
                    identifier = entry.get('dce:identifier', '') or entry.get(
                        'dc:identifier', '')
                    if identifier and identifier.startswith('SDN:P02::'):
                        code = identifier.replace('SDN:P02::', '')

                        # Extract preferred label
                        pref_label = ""
                        if 'skos:prefLabel' in entry:
                            label_obj = entry['skos:prefLabel']
                            if isinstance(label_obj, dict) and '@value' in label_obj:
                                pref_label = label_obj['@value']
                            elif isinstance(label_obj, str):
                                pref_label = label_obj

                        # Extract definition
                        definition = ""
                        if 'skos:definition' in entry:
                            def_obj = entry['skos:definition']
                            if isinstance(def_obj, dict) and '@value' in def_obj:
                                definition = def_obj['@value']
                            elif isinstance(def_obj, str):
                                definition = def_obj

                        if code and pref_label:
                            self.p02_parameters[code] = {
                                'label': pref_label,
                                'definition': definition
                            }

            print(f"Loaded {len(self.p02_parameters)} P02 parameters")

        except FileNotFoundError:
            print(f"Error: {file_path} not found")
            raise
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON from {file_path}: {e}")
            raise

    def create_recommendations_prompt(self, symphony_entry: Dict[str, str]) -> str:
        """Create a prompt focused on recommendations for data improvement."""

        # Build P02 parameters list - use more parameters with larger context model
        p02_items = list(self.p02_parameters.items())
        # Use more parameters since Mistral has larger context window
        step = max(1, len(p02_items) // 300)  # Get ~300 parameters
        sampled_items = p02_items[::step][:300]

        p02_list = []
        for code, data in sampled_items:
            p02_list.append(f"- {code}: {data['label']}")
            if data['definition'] and len(data['definition']) > 10:
                # Truncate very long definitions
                definition = data['definition'][:150] + \
                    "..." if len(data['definition']
                                 ) > 150 else data['definition']
                p02_list.append(f"  Definition: {definition}")

        p02_text = "\n".join(p02_list)

        prompt = f"""You are a marine science expert. Based on the Symphony layer name and data improvement recommendations, suggest P02 parameters that would be needed to address the identified data gaps and limitations.

Symphony Layer: {symphony_entry['name']}

Description:
{symphony_entry['summary'] if 'summary' in symphony_entry else 'No description provided.'}

Limitations:
{symphony_entry['limitations'] if symphony_entry['limitations'] else 'No specific limitations provided.'}

Data Improvement Recommendations:
{symphony_entry['recommendations'] if symphony_entry['recommendations'] else 'No specific recommendations provided.'}

Available P02 Parameters:
{p02_text}

TASK: Suggest P02 parameters that would help address the data limitations described in the recommendations or recreate
the data layer. 

Focus on:
1. **Parameters mentioned in recommendations** - look for specific variables, measurements, or data types needed
2. **Parameters that could be used to recreate the layer** - suggest parameters that would help reconstruct the layer based on its name and recommendations
3. **Proxy parameters** - suggest parameters that could serve as proxies for missing data or measurements

Return ONLY a JSON array of relevant P02 codes:
["CODE1", "CODE2", "CODE3"]

Be selective - suggest maximum 30 codes that would directly help improve the data as described. Order them by relevance.
If no clear improvement needs are mentioned, return []."""

        return prompt

    def make_api_request(self, prompt: str) -> Optional[List[str]]:
        """Make request to OpenRouter API and parse response."""

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.2,  # Lower temperature for more consistent results
            "max_tokens": 6000  # Increase for potentially longer responses
        }

        try:
            response = requests.post(
                self.api_url, json=payload, headers=headers)
            response.raise_for_status()

            result = response.json()

            if 'choices' in result and len(result['choices']) > 0:
                content = result['choices'][0]['message']['content'].strip()

                # Try to parse JSON response
                try:
                    codes = json.loads(content)
                    if isinstance(codes, list):
                        return codes
                    else:
                        print(
                            f"Warning: API returned non-list response: {content}")
                        return []
                except json.JSONDecodeError:
                    print(
                        f"Warning: Could not parse API response as JSON: {content[:500]}...")

                    # Try to extract JSON from markdown code blocks if present
                    if '```json' in content:
                        try:
                            start = content.find('```json') + 7
                            end = content.find('```', start)
                            json_part = content[start:end].strip()

                            # Clean up JavaScript-style comments from JSON
                            import re
                            json_part = re.sub(
                                r'//.*$', '', json_part, flags=re.MULTILINE)
                            # Remove trailing commas
                            json_part = re.sub(r',\s*}', '}', json_part)
                            # Remove trailing commas
                            json_part = re.sub(r',\s*]', ']', json_part)

                            codes = json.loads(json_part)
                            if isinstance(codes, list):
                                return codes
                        except Exception as e:
                            print(f"Error parsing complex JSON: {e}")
                            pass

                    # Try to extract a simple array from the text
                    import re
                    array_match = re.search(r'\[[\s\S]*?\]', content)
                    if array_match:
                        try:
                            array_text = array_match.group(0)
                            # Clean up comments
                            array_text = re.sub(
                                r'//.*$', '', array_text, flags=re.MULTILINE)
                            array_text = re.sub(r',\s*]', ']', array_text)
                            codes = json.loads(array_text)
                            if isinstance(codes, list):
                                return codes
                        except:
                            pass

                    return []
            else:
                print("Warning: No choices in API response")
                return []

        except requests.exceptions.RequestException as e:
            print(f"API request error: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error in API request: {e}")
            return None

    def match_symphony_entry(self, symphony_entry: Dict[str, str]) -> List[Dict[str, str]]:
        """Match a single Symphony entry to P02 parameters based on recommendations."""

        print(f"Matching: {symphony_entry['name']}")

        # Create recommendations-focused prompt
        prompt = self.create_recommendations_prompt(symphony_entry)

        # Make API request
        codes = self.make_api_request(prompt)

        if codes is None:
            print(f"  Failed to get response for {symphony_entry['name']}")
            return []

        # Convert codes to code+label format
        matched_parameters = []
        for code in codes:
            if code in self.p02_parameters:
                matched_parameters.append({
                    'code': code,
                    'label': self.p02_parameters[code]['label']
                })
            else:
                print(f"  Warning: Unknown P02 code returned: {code}")

        print(
            f"  Found {len(matched_parameters)} matches based on recommendations")
        return matched_parameters

    def match_all_entries(self) -> Dict[str, List[Dict[str, str]]]:
        """Match all Symphony entries to P02 parameters."""

        print("\nStarting recommendations-based matching process...")
        results = {}

        total_entries = len(self.symphony_data)
        for i, entry in enumerate(self.symphony_data, 1):
            print(f"\nProgress: {i}/{total_entries}")

            matched_params = self.match_symphony_entry(entry)
            results[entry['name']] = matched_params

            # Rate limiting
            if i < total_entries:
                time.sleep(self.request_delay)

        return results

    def save_results(self, results: Dict[str, List[Dict[str, str]]],
                     output_file: str = "../source-data/symphony_p02_matches.json") -> None:
        """Save matching results to JSON file."""

        print(f"\nSaving results to {output_file}...")

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        print(f"Results saved successfully!")

        # Print summary
        total_entries = len(results)
        entries_with_matches = sum(
            1 for matches in results.values() if matches)
        total_matches = sum(len(matches) for matches in results.values())

        print(f"\nSummary:")
        print(f"  Total Symphony entries: {total_entries}")
        print(f"  Entries with matches: {entries_with_matches}")
        print(f"  Total parameter matches: {total_matches}")
        print(
            f"  Average matches per entry: {total_matches/total_entries:.1f}")


def main():
    """Main execution function."""
    try:
        # Initialize matcher
        matcher = SymphonyP02MatcherV2()

        # Load data
        matcher.load_symphony_metadata()
        matcher.load_p02_parameters()

        # Perform matching
        results = matcher.match_all_entries()

        # Save results
        matcher.save_results(results)

        print("\nRecommendations-based matching completed successfully!")

    except Exception as e:
        print(f"Error: {e}")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
