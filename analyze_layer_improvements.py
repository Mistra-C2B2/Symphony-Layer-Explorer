#!/usr/bin/env python3
"""
Symphony Layer Improvement Analysis Script

This script uses AI to analyze Symphony metadata and determine:
1. Improvement potential based on limitations and recommendations
2. Overall perceived difficulty of implementing improvements
3. Whether the layer can be generated or improved using satellite remote sensing data
"""

import json
import os
import requests
import time
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv


class LayerImprovementAnalyzer:
    def __init__(self):
        """Initialize the analyzer with API client."""
        # Load environment variables
        load_dotenv()

        self.api_key = os.getenv(
            'OPEN_ROUTER_API_KEY') or os.getenv('OPEN_ROUTER_KEY')
        if not self.api_key:
            raise ValueError(
                "OPEN_ROUTER_API_KEY or OPEN_ROUTER_KEY not found in environment variables")

        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = "google/gemini-2.5-flash"  # Use fast model for analysis

        # Data storage
        self.symphony_data = []

        # Rate limiting
        self.request_delay = 1  # seconds between requests

        print("Initialized Symphony Layer Improvement Analyzer")

    def load_symphony_metadata(self, file_path: str = "symphony_layer_metadata.json") -> None:
        """Load Symphony metadata."""
        print(f"Loading Symphony metadata from {file_path}...")

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                raw_data = json.load(f)

            self.symphony_data = []
            for entry in raw_data:
                # Extract relevant fields
                symphony_entry = {
                    'name': entry.get('Name', ''),
                    'summary': entry.get('Summary', ''),
                    'limitations': entry.get('LimitationsforuseinSymphony', ''),
                    'recommendations': entry.get('Recommendationsfordataimprovement', ''),
                    'lineage': entry.get('Lineage', ''),
                    'data_format': entry.get('DataFormat', ''),
                    'temporal_period': entry.get('TemporalPeriod', ''),
                    'maintenance': entry.get('Maintenance', '')
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

    def create_analysis_prompt(self, symphony_entry: Dict[str, str]) -> str:
        """Create a prompt for AI-powered improvement analysis."""

        context_parts = []
        if symphony_entry['name']:
            context_parts.append(f"Layer Name: {symphony_entry['name']}")
        if symphony_entry['summary']:
            context_parts.append(f"Summary: {symphony_entry['summary']}")
        if symphony_entry['limitations']:
            context_parts.append(
                f"Limitations: {symphony_entry['limitations']}")
        if symphony_entry['recommendations']:
            context_parts.append(
                f"Recommendations: {symphony_entry['recommendations']}")
        if symphony_entry['lineage']:
            context_parts.append(f"Lineage: {symphony_entry['lineage']}")
        if symphony_entry['temporal_period']:
            context_parts.append(
                f"Temporal Period: {symphony_entry['temporal_period']}")
        if symphony_entry['maintenance']:
            context_parts.append(
                f"Maintenance: {symphony_entry['maintenance']}")

        context = "\n".join(context_parts)

        prompt = f"""You are a marine data science expert with expertise in data analysis and satellite remote sensing. Analyze this Symphony marine planning layer and assess three key aspects:

Symphony Layer Information:
{context}

TASK: Based on the limitations and recommendations, provide a JSON response with exactly this structure:

{{
  "improvement_potential": "small|medium|large",
  "difficulty": "low|medium|high",
  "satellite": true|false,
  "reasoning": {{
    "improvement_justification": "Brief explanation of why you chose this improvement level",
    "difficulty_justification": "Brief explanation of why you chose this difficulty level",
    "satellite_justification": "Brief explanation of whether satellite remote sensing can help generate or improve this layer"
  }}
}}

IMPROVEMENT POTENTIAL CRITERIA (i.e. how much the layer could be improved according to the limitations and recommendations):
- "small": Limited potential for enhancement, such as refining existing methods, adding specific data sources, or closing minor data gaps.
- "medium": Moderate potential for improvement, through integrating multiple new data sources, expanding methodological approaches, or addressing broader gaps.
- "large": High potential for substantial improvement, requiring new data collection, advanced modeling, or fundamental changes to methodologies.

DIFFICULTY CRITERIA (i.e. how difficult it would be to implement the improvements):
- "low": Involves moderate technical expertise, limited new data collection, or basic coordination between organizations.
- "medium": Involves advanced technical expertise, substantial new data collection, or collaboration across multiple organizations.
- "high": Involves significant resources, advanced technical expertise, extensive data collection, or major infrastructure changes.

SATELLITE REMOTE SENSING CRITERIA:
- true: The layer data can be generated, enhanced, or validated using satellite observations (e.g., sea surface temperature, chlorophyll-a, land cover, bathymetry, coastal changes, algal blooms, water quality indicators, habitat mapping, etc.)
- false: The layer requires in-situ measurements, biological sampling, acoustic data, or other non-satellite data sources that cannot be effectively replaced or supplemented by satellite observations

Consider satellite capabilities for:
- Ocean color and water quality parameters
- Sea surface temperature and currents
- Coastal and habitat mapping
- Bathymetry (satellite-derived bathymetry)
- Ice cover and seasonal changes
- Land use and coastal development
- Algal blooms and phytoplankton
- Suspended sediments
- Oil spills and pollution
- Wave height and sea state

Focus on:
1. What the limitations explicitly state as problems
2. What the recommendations explicitly suggest as improvements
3. The complexity and scope of changes needed
4. Whether satellite data could address the layer's data gaps or improve accuracy
5. The technical and resource requirements implied

Be objective and base your assessment strictly on the provided information.

Return ONLY the JSON response, no additional text."""

        return prompt

    def make_api_request(self, prompt: str) -> Optional[Dict[str, Any]]:
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
            "temperature": 0.1,  # Very low temperature for consistent analysis
            "max_tokens": 1000
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
                    analysis = json.loads(content)
                    return analysis
                except json.JSONDecodeError:
                    print(
                        f"Warning: Could not parse API response as JSON: {content[:500]}...")

                    # Try to extract JSON from markdown code blocks if present
                    if '```json' in content:
                        try:
                            start = content.find('```json') + 7
                            end = content.find('```', start)
                            json_part = content[start:end].strip()
                            analysis = json.loads(json_part)
                            return analysis
                        except Exception as e:
                            print(f"Error parsing complex JSON: {e}")
                            pass

                    # Try to extract a JSON object from the text
                    import re
                    json_match = re.search(r'\{[\s\S]*\}', content)
                    if json_match:
                        try:
                            json_text = json_match.group(0)
                            analysis = json.loads(json_text)
                            return analysis
                        except:
                            pass

                    return None
            else:
                print("Warning: No choices in API response")
                return None

        except requests.exceptions.RequestException as e:
            print(f"API request error: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error in API request: {e}")
            return None

    def analyze_symphony_entry(self, symphony_entry: Dict[str, str]) -> Optional[Dict[str, Any]]:
        """Analyze a single Symphony entry for improvement potential and difficulty."""

        print(f"Analyzing: {symphony_entry['name']}")

        # Create analysis prompt
        prompt = self.create_analysis_prompt(symphony_entry)

        # Make API request
        analysis = self.make_api_request(prompt)

        if analysis is None:
            print(f"  Failed to get analysis for {symphony_entry['name']}")
            return None

        # Validate the analysis structure
        if not all(key in analysis for key in ['improvement_potential', 'difficulty', 'satellite']):
            print(
                f"  Warning: Incomplete analysis for {symphony_entry['name']}")
            return None

        # Validate improvement_potential values
        valid_improvements = ['small', 'medium', 'large']
        if analysis['improvement_potential'] not in valid_improvements:
            print(
                f"  Warning: Invalid improvement_potential value: {analysis['improvement_potential']}")
            analysis['improvement_potential'] = 'medium'  # Default fallback

        # Validate difficulty values
        valid_difficulties = ['low', 'medium', 'high']
        if analysis['difficulty'] not in valid_difficulties:
            print(
                f"  Warning: Invalid difficulty value: {analysis['difficulty']}")
            analysis['difficulty'] = 'medium'  # Default fallback

        # Validate satellite value
        if not isinstance(analysis['satellite'], bool):
            print(
                f"  Warning: Invalid satellite value: {analysis['satellite']}")
            analysis['satellite'] = False  # Default fallback

        print(
            f"  Result: {analysis['improvement_potential']} potential, {analysis['difficulty']} difficulty, satellite: {analysis['satellite']}")
        return analysis

    def analyze_all_entries(self) -> Dict[str, Dict[str, Any]]:
        """Analyze all Symphony entries."""

        print("\nStarting improvement analysis...")
        results = {}

        total_entries = len(self.symphony_data)
        for i, entry in enumerate(self.symphony_data, 1):
            print(f"\nProgress: {i}/{total_entries}")

            analysis = self.analyze_symphony_entry(entry)
            if analysis:
                results[entry['name']] = analysis

            # Rate limiting
            if i < total_entries:
                time.sleep(self.request_delay)

        return results

    def save_results(self, results: Dict[str, Dict[str, Any]],
                     output_file: str = "symphony_improvement_analysis.json") -> None:
        """Save analysis results to JSON file."""

        print(f"\nSaving results to {output_file}...")

        # Add metadata about the analysis
        output_data = {
            "analysis_metadata": {
                "total_layers": len(results),
                "analysis_date": time.strftime("%Y-%m-%d %H:%M:%S"),
                "model_used": self.model,
                "criteria": {
                    "improvement_potential": {
                        "small": "Minor tweaks, metadata updates, or documentation improvements",
                        "medium": "Moderate enhancements like adding new data sources, updating methodologies, or addressing specific data gaps",
                        "large": "Major overhauls requiring new data collection, advanced modeling, or fundamental methodology changes"
                    },
                    "difficulty": {
                        "low": "Can be addressed with existing resources, simple data updates, or administrative changes",
                        "medium": "Requires moderate technical expertise, some new data collection, or coordination between organizations",
                        "high": "Requires significant resources, advanced technical expertise, extensive data collection, or major infrastructure changes"
                    },
                    "satellite": {
                        "true": "The layer data can be generated, enhanced, or validated using satellite remote sensing observations",
                        "false": "The layer requires in-situ measurements, biological sampling, acoustic data, or other non-satellite data sources"
                    }
                }
            },
            "layer_analyses": results
        }

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)

        print(f"Results saved successfully!")

        # Print summary statistics
        improvement_counts = {}
        difficulty_counts = {}
        satellite_counts = {'true': 0, 'false': 0}

        for analysis in results.values():
            improvement = analysis['improvement_potential']
            difficulty = analysis['difficulty']
            satellite = str(analysis['satellite']).lower()

            improvement_counts[improvement] = improvement_counts.get(
                improvement, 0) + 1
            difficulty_counts[difficulty] = difficulty_counts.get(
                difficulty, 0) + 1
            satellite_counts[satellite] = satellite_counts.get(
                satellite, 0) + 1

        print(f"\nSummary:")
        print(f"  Total layers analyzed: {len(results)}")
        print(f"  Improvement potential:")
        for improvement, count in improvement_counts.items():
            print(f"    {improvement}: {count}")
        print(f"  Difficulty levels:")
        for difficulty, count in difficulty_counts.items():
            print(f"    {difficulty}: {count}")
        print(f"  Satellite remote sensing potential:")
        for satellite, count in satellite_counts.items():
            print(f"    {satellite}: {count}")


def main():
    """Main execution function."""
    try:
        # Initialize analyzer
        analyzer = LayerImprovementAnalyzer()

        # Load data
        analyzer.load_symphony_metadata()

        # Perform analysis
        results = analyzer.analyze_all_entries()

        # Save results
        analyzer.save_results(results)

        print("\nImprovement analysis completed successfully!")

        return 0

    except Exception as e:
        print(f"Error: {e}")
        return 1


if __name__ == "__main__":
    exit(main())
