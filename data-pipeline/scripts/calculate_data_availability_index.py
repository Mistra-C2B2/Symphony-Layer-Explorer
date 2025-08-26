#!/usr/bin/env python3
"""
Symphony Layer Data Availability Index Calculator

This script calculates the data availability index for each Symphony layer by:
1. Loading the Symphony-P02 parameter mappings from symphony_p02_matches.json
2. Loading the P02 parameter availability indexes from p02_analysis.json
3. Computing the average parameter availability index for each layer
4. Generating a JSON file with the results
"""

import json
import statistics
from typing import Dict, List, Any


class DataAvailabilityCalculator:
    def __init__(self):
        """Initialize the calculator."""
        self.symphony_p02_matches = {}
        self.p02_analysis = {}

        print("Initialized Data Availability Index Calculator")

    def load_symphony_p02_matches(self, file_path: str = "../source-data/symphony_p02_matches.json") -> None:
        """Load Symphony-P02 parameter matches."""
        print(f"Loading Symphony-P02 matches from {file_path}...")

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                self.symphony_p02_matches = json.load(f)

            print(
                f"Loaded P02 matches for {len(self.symphony_p02_matches)} Symphony layers")

        except FileNotFoundError:
            print(f"Error: {file_path} not found")
            raise
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON from {file_path}: {e}")
            raise

    def load_p02_analysis(self, file_path: str = "../output/p02_analysis.json") -> None:
        """Load P02 parameter availability analysis."""
        print(f"Loading P02 analysis from {file_path}...")

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                self.p02_analysis = json.load(f)

            print(
                f"Loaded availability indexes for {len(self.p02_analysis)} P02 parameters")

        except FileNotFoundError:
            print(f"Error: {file_path} not found")
            raise
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON from {file_path}: {e}")
            raise

    def get_parameter_availability_index(self, p02_code: str) -> float:
        """Get the availability index for a P02 parameter. Returns 0 if not found or None."""

        if p02_code in self.p02_analysis:
            param_data = self.p02_analysis[p02_code]
            availability_index = param_data.get('parameter_availability_index')

            # Return 0 if None or not found
            if availability_index is None:
                return 0.0
            else:
                return float(availability_index)

        # Parameter not found, return 0
        return 0.0

    def calculate_layer_availability_index(self, layer_name: str, parameters: List[Dict[str, str]]) -> Dict[str, Any]:
        """Calculate the data availability index for a single layer."""

        if not parameters:
            return {
                'data_availability_index': 0.0,
                'parameter_count': 0,
                'parameter_details': []
            }

        availability_indexes = []
        parameter_details = []

        for param in parameters:
            p02_code = param['code']
            p02_label = param.get('label', 'Unknown')

            availability_index = self.get_parameter_availability_index(
                p02_code)
            availability_indexes.append(availability_index)

            parameter_details.append({
                'code': p02_code,
                'label': p02_label,
                'availability_index': availability_index
            })

        # Calculate average availability index
        avg_availability = statistics.mean(availability_indexes)

        return {
            'data_availability_index': round(avg_availability, 3),
            'parameter_count': len(parameters),
            'parameter_details': parameter_details
        }

    def calculate_all_layers(self) -> Dict[str, Dict[str, Any]]:
        """Calculate data availability indexes for all Symphony layers."""

        print("\nCalculating data availability indexes for all layers...")
        results = {}

        total_layers = len(self.symphony_p02_matches)
        processed = 0

        for layer_name, parameters in self.symphony_p02_matches.items():
            print(f"Processing: {layer_name} ({len(parameters)} parameters)")

            availability_data = self.calculate_layer_availability_index(
                layer_name, parameters)
            results[layer_name] = availability_data

            processed += 1
            if processed % 10 == 0:
                print(
                    f"  Progress: {processed}/{total_layers} layers processed")

        return results

    def save_results(self, results: Dict[str, Dict[str, Any]],
                     output_file: str = "../output/symphony_data_availability_index.json") -> None:
        """Save the data availability index results to JSON file."""

        print(f"\nSaving results to {output_file}...")

        # Calculate overall statistics
        all_indexes = [layer['data_availability_index']
                       for layer in results.values()]
        total_parameters = sum(layer['parameter_count']
                               for layer in results.values())

        output_data = {
            "metadata": {
                "description": "Data availability index for Symphony layers based on P02 parameter availability",
                "calculation_method": "Average of parameter availability indexes for each layer (None values treated as 0)",
                "total_layers": len(results),
                "total_parameters": total_parameters,
                "overall_statistics": {
                    "mean_availability_index": round(statistics.mean(all_indexes), 3) if all_indexes else 0.0,
                    "median_availability_index": round(statistics.median(all_indexes), 3) if all_indexes else 0.0,
                    "min_availability_index": round(min(all_indexes), 3) if all_indexes else 0.0,
                    "max_availability_index": round(max(all_indexes), 3) if all_indexes else 0.0,
                    "std_deviation": round(statistics.stdev(all_indexes), 3) if len(all_indexes) > 1 else 0.0
                }
            },
            "layer_availability": results
        }

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)

        print(f"Results saved successfully!")

        # Print summary
        print(f"\nSummary Statistics:")
        print(f"  Total layers: {len(results)}")
        print(f"  Total P02 parameters: {total_parameters}")
        print(
            f"  Mean availability index: {output_data['metadata']['overall_statistics']['mean_availability_index']}")
        print(
            f"  Median availability index: {output_data['metadata']['overall_statistics']['median_availability_index']}")
        print(
            f"  Range: {output_data['metadata']['overall_statistics']['min_availability_index']} - {output_data['metadata']['overall_statistics']['max_availability_index']}")

        # Show layers with highest and lowest availability
        sorted_layers = sorted(
            results.items(), key=lambda x: x[1]['data_availability_index'], reverse=True)

        print(f"\nTop 5 layers by data availability:")
        for i, (layer_name, data) in enumerate(sorted_layers[:5], 1):
            print(
                f"  {i}. {layer_name}: {data['data_availability_index']} ({data['parameter_count']} parameters)")

        print(f"\nBottom 5 layers by data availability:")
        for i, (layer_name, data) in enumerate(sorted_layers[-5:], 1):
            print(
                f"  {i}. {layer_name}: {data['data_availability_index']} ({data['parameter_count']} parameters)")


def main():
    """Main execution function."""
    try:
        # Initialize calculator
        calculator = DataAvailabilityCalculator()

        # Load data
        calculator.load_symphony_p02_matches()
        calculator.load_p02_analysis()

        # Calculate availability indexes
        results = calculator.calculate_all_layers()

        # Save results
        calculator.save_results(results)

        print("\nData availability index calculation completed successfully!")

        return 0

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit(main())
