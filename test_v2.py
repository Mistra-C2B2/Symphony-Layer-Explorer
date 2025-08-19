#!/usr/bin/env python3
"""
Test script for the v2 recommendations-focused matching
"""

import json
from match_symphony_to_p02 import SymphonyP02MatcherV2


def test_v2_approach():
    """Test the v2 approach with a few entries"""

    try:
        # Initialize matcher
        print("Initializing v2 matcher...")
        matcher = SymphonyP02MatcherV2()

        # Load data
        print("Loading data...")
        matcher.load_symphony_metadata('data/symphony_layer_metadata.json')
        matcher.load_p02_parameters('p02_discovery_parameters.jsonld')

        # Test with first 3 entries
        print("\nTesting v2 approach with first 5 Symphony entries...")
        test_entries = matcher.symphony_data[:5]

        results = {}

        for entry in test_entries:
            print(f"\nTesting: {entry['name']}")
            print(
                f"Recommendations: {entry['recommendations'][:100]}..." if entry['recommendations'] else "No recommendations")

            # Create prompt to show what we're asking
            prompt = matcher.create_recommendations_prompt(entry)
            print(f"Prompt focus: Layer name + recommendations for improvement")

            # Get matches
            matched_params = matcher.match_symphony_entry(entry)
            results[entry['name']] = matched_params

            print(
                f"✓ Found {len(matched_params)} recommendation-based matches")
            for param in matched_params:
                print(f"  - {param['code']}: {param['label']}")

        # Save test results
        with open('test_v2_matches.json', 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        print(f"\nV2 test results saved to test_v2_matches.json")
        print(f"Processed {len(results)} entries")

    except Exception as e:
        print(f"Test failed: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    test_v2_approach()
