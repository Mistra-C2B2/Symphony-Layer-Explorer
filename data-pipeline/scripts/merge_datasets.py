#!/usr/bin/env python3
"""
Dataset Merger

Creates 3 essential files for the web application:
1. symphony_layers.json - Complete layer data (metadata + improvement + P02 + availability)
2. p02_analysis.json - P02 parameter availability analysis (copied as-is)
3. catalogue.json - Dataset catalogue (copied as-is)
"""

import json
import os
import shutil
import re
from typing import Dict, List, Any


class SimplifiedDatasetMerger:
    def __init__(self):
        """Initialize the simplified dataset merger."""
        self.data_dir = "../source-data"
        self.intermediate_dir = "../output"
        self.output_dir = "../../react-web-app/public/data"

        # Ensure output directory exists
        os.makedirs(self.output_dir, exist_ok=True)

        # Editable key mapping for symphony_layers_metadata.json fields
        # Format: "OriginalKey": "desired_snake_case_key"
        # Add or modify mappings as needed for your preferred output format
        self.key_mapping = {
            "Name": "name",
            "SwedishName": "swedish_name",
            "SymphonyTheme": "symphony_theme",
            "SymphonyCategory": "symphony_category",
            "SymphonyDataType": "symphony_data_type",
            "DateCreated": "date_created",
            "Status": "status",
            "DataFormat": "data_format",
            "TemporalPeriod": "temporal_period",
            "ResourceType": "resource_type",
            "CoordinateReferenceSystem": "coordinate_reference_system",
            "Summary": "summary",
            "Summary(Swedish)": "summary_swedish",
            "Lineage": "lineage",
            "LimitationsforuseinSymphony": "limitations_for_use_in_symphony",
            "Recommendationsfordataimprovement": "recommendations_for_data_improvement",
            "Dataauthoringorganisation": "data_authoring_organisation",
            "Contactorganisation": "contact_organisation",
            "DataAuthorContact": "data_author_contact",
            "DataOwner": "data_owner",
            "DataOwnerContact": "data_owner_contact",
            "INSPIREtopiccategory": "inspire_topic_category",
            "INSPIREtheme": "inspire_theme",
            "GEMETkeywords": "gemet_keywords",
            "AccessUseRestrictions": "access_use_restrictions",
            "UseLimitations": "use_limitations",
            "OtherRestrictions": "other_restrictions",
            "MapAcknowledgement": "map_acknowledgement",
            "SecurityClassification": "security_classification",
            "Maintenance": "maintenance",
            "MetadataDate": "metadata_date",
            "MetadataOrganisation": "metadata_organisation",
            "MetadataContact": "metadata_contact"
        }

        print("Initialized Simplified Dataset Merger")
        print(
            f"Loaded key mapping with {len(self.key_mapping)} field mappings")

    def convert_keys_using_mapping(self, obj: Dict[str, Any]) -> Dict[str, Any]:
        """Convert keys in a dictionary using the predefined mapping."""
        if not isinstance(obj, dict):
            return obj

        converted_dict = {}
        unmapped_keys = []

        for key, value in obj.items():
            if key in self.key_mapping:
                # Use mapped key
                new_key = self.key_mapping[key]
                converted_dict[new_key] = value
            else:
                # Keep original key and track unmapped keys
                converted_dict[key] = value
                unmapped_keys.append(key)

        if unmapped_keys:
            print(f"  Warning: Found unmapped keys: {unmapped_keys}")

        return converted_dict

    def load_json_file(self, file_path: str) -> Any:
        """Load a JSON file and return its contents."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            print(f"✓ Loaded {file_path}")
            return data
        except FileNotFoundError:
            print(f"✗ Error: {file_path} not found")
            raise
        except json.JSONDecodeError as e:
            print(f"✗ Error parsing JSON from {file_path}: {e}")
            raise

    def create_symphony_layers_json(self) -> None:
        """Create the combined symphony_layers.json file."""
        print("\n=== Creating symphony_layers.json ===")

        # Load source data
        symphony_metadata = self.load_json_file(os.path.join(
            self.data_dir, "symphony_layer_metadata.json"))
        improvement_analysis = self.load_json_file(os.path.join(
            self.intermediate_dir, "symphony_improvement_analysis.json"))
        p02_matches = self.load_json_file(os.path.join(
            self.data_dir, "symphony_p02_matches.json"))
        availability_data = self.load_json_file(os.path.join(
            self.intermediate_dir, "symphony_data_availability_index.json"))

        # Extract structured data
        improvement_analyses = improvement_analysis.get("layer_analyses", {})
        layer_availability = availability_data.get("layer_availability", {})

        # Process each layer
        combined_layers = []
        processed_count = 0
        skipped_count = 0

        for layer_entry in symphony_metadata:
            if not isinstance(layer_entry, dict) or "Name" not in layer_entry:
                skipped_count += 1
                continue

            layer_name = layer_entry["Name"]

            # Skip schema entries and invalid entries
            if (layer_name.startswith("The title of the data") or
                len(layer_name) > 100 or
                    layer_name in ["", "N/A"]):
                skipped_count += 1
                continue

            # Filter by category - only include Ecosystem or Pressures
            symphony_category = layer_entry.get("SymphonyCategory", "")
            if symphony_category not in ["Ecosystem", "Pressure"]:
                skipped_count += 1
                continue

            # Convert original metadata keys using the mapping
            enhanced_layer = self.convert_keys_using_mapping(layer_entry)

            # Add improvement analysis data with reasoning
            if layer_name in improvement_analyses:
                analysis = improvement_analyses[layer_name]
                enhanced_layer["improvement_potential"] = analysis.get(
                    "improvement_potential", "medium")
                enhanced_layer["difficulty"] = analysis.get(
                    "difficulty", "medium")
                enhanced_layer["satellite"] = analysis.get("satellite", False)
                enhanced_layer["digital_earth_sweden"] = analysis.get("digital_earth_sweden", False)

                # Add reasoning from improvement analysis
                reasoning = analysis.get("reasoning", {})
                if reasoning:
                    enhanced_layer["improvement_reasoning"] = {
                        "improvement_justification": reasoning.get("improvement_justification", ""),
                        "difficulty_justification": reasoning.get("difficulty_justification", ""),
                        "satellite_justification": reasoning.get("satellite_justification", ""),
                        "digital_earth_sweden_justification": reasoning.get("digital_earth_sweden_justification", "")
                    }
            else:
                enhanced_layer["improvement_potential"] = "medium"
                enhanced_layer["difficulty"] = "medium"
                enhanced_layer["satellite"] = False
                enhanced_layer["digital_earth_sweden"] = False
                enhanced_layer["improvement_reasoning"] = {
                    "improvement_justification": "",
                    "difficulty_justification": "",
                    "satellite_justification": "",
                    "digital_earth_sweden_justification": ""
                }

            # Add P02 parameter matches
            enhanced_layer["p02_parameters"] = p02_matches.get(layer_name, [])

            # Add data availability index
            if layer_name in layer_availability:
                availability_info = layer_availability[layer_name]
                enhanced_layer["data_availability_index"] = availability_info.get(
                    "data_availability_index", 0.0)
                enhanced_layer["parameter_count"] = availability_info.get(
                    "parameter_count", 0)
                enhanced_layer["parameter_details"] = availability_info.get(
                    "parameter_details", [])
            else:
                enhanced_layer["data_availability_index"] = 0.0
                enhanced_layer["parameter_count"] = 0
                enhanced_layer["parameter_details"] = []

            combined_layers.append(enhanced_layer)
            processed_count += 1

            if processed_count % 10 == 0:
                print(f"  Processed {processed_count} layers...")

        # Save combined data
        output_file = os.path.join(self.output_dir, "symphony_layers.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(combined_layers, f, indent=2, ensure_ascii=False)

        print(f"✓ Created {output_file}")
        print(
            f"  Processed: {processed_count} layers (Ecosystem & Pressures only)")
        print(f"  Skipped: {skipped_count} invalid/filtered entries")
        print(f"  Keys converted using mapping")
        print(f"  Improvement reasoning included")

        return combined_layers

    def copy_essential_files(self) -> None:
        """Copy p02_analysis.json and catalogue.json as-is."""
        print("\n=== Copying Essential Files ===")

        files_to_copy = [
            "p02_analysis.json",
            "catalogue.json"
        ]

        for filename in files_to_copy:
            # p02_analysis.json is in intermediate_dir, catalogue.json is in data_dir
            if filename == "p02_analysis.json":
                src = os.path.join(self.intermediate_dir, filename)
            else:
                src = os.path.join(self.data_dir, filename)
            dst = os.path.join(self.output_dir, filename)

            if os.path.exists(src):
                shutil.copy2(src, dst)
                print(f"✓ Copied {filename}")
            else:
                src_dir = self.intermediate_dir if filename == "p02_analysis.json" else self.data_dir
                print(f"✗ Warning: {filename} not found in {src_dir}")

    def validate_output(self) -> None:
        """Validate the created files."""
        print("\n=== Validation ===")

        required_files = [
            "symphony_layers.json",
            "p02_analysis.json",
            "catalogue.json"
        ]

        all_valid = True

        for filename in required_files:
            filepath = os.path.join(self.output_dir, filename)
            if os.path.exists(filepath):
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)

                    if filename == "symphony_layers.json":
                        print(f"✓ {filename}: {len(data)} layers")
                    elif filename == "p02_analysis.json":
                        print(f"✓ {filename}: {len(data)} P02 parameters")
                    elif filename == "catalogue.json":
                        print(f"✓ {filename}: {len(data)} datasets")

                except json.JSONDecodeError as e:
                    print(f"✗ {filename}: Invalid JSON - {e}")
                    all_valid = False
            else:
                print(f"✗ {filename}: File not found")
                all_valid = False

        if all_valid:
            print("✓ All files validated successfully!")
        else:
            print("✗ Some files failed validation")

        return all_valid

    def generate_summary(self, layers_data: List[Dict[str, Any]]) -> None:
        """Generate summary statistics."""
        print("\n=== Summary Statistics ===")

        # Count improvement potentials
        improvement_counts = {"small": 0, "medium": 0, "large": 0}
        difficulty_counts = {"low": 0, "medium": 0, "high": 0}
        satellite_count = {"true": 0, "false": 0}
        availability_indexes = []
        total_p02_params = 0

        for layer in layers_data:
            # Count improvement potential
            improvement = layer.get("improvement_potential", "medium")
            if improvement in improvement_counts:
                improvement_counts[improvement] += 1

            # Count difficulty
            difficulty = layer.get("difficulty", "medium")
            if difficulty in difficulty_counts:
                difficulty_counts[difficulty] += 1

            # Count satellite potential
            satellite = str(layer.get("satellite", False)).lower()
            if satellite in satellite_count:
                satellite_count[satellite] += 1

            # Collect availability indexes
            availability = layer.get("data_availability_index", 0.0)
            if availability > 0:
                availability_indexes.append(availability)

            # Count P02 parameters
            p02_params = layer.get("p02_parameters", [])
            total_p02_params += len(p02_params)

        print(f"Total Layers: {len(layers_data)}")
        print(f"Total P02 Parameter Matches: {total_p02_params}")
        print(f"Improvement Potential: {improvement_counts}")
        print(f"Difficulty Distribution: {difficulty_counts}")
        print(f"Satellite Potential: {satellite_count}")

        if availability_indexes:
            import statistics
            print(f"Data Availability:")
            print(f"  Mean: {statistics.mean(availability_indexes):.3f}")
            print(f"  Median: {statistics.median(availability_indexes):.3f}")
            print(
                f"  Range: {min(availability_indexes):.3f} - {max(availability_indexes):.3f}")

    def merge_datasets(self) -> bool:
        """Main method to merge all datasets."""
        print("Starting simplified dataset merging process...")

        try:
            # Create combined symphony layers file
            layers_data = self.create_symphony_layers_json()

            # Copy other essential files
            self.copy_essential_files()

            # Validate output
            validation_success = self.validate_output()

            # Generate summary
            self.generate_summary(layers_data)

            if validation_success:
                print(f"\n🎉 Dataset merging completed successfully!")
                print(f"📁 Output files ready in: {self.output_dir}/")
                print("\n📋 Ready files:")
                print("   • symphony_layers.json (complete layer data)")
                print("   • p02_analysis.json (parameter availability)")
                print("   • catalogue.json (dataset catalogue)")
            else:
                print("\n⚠️  Dataset merging completed with validation errors.")
                return False

            return True

        except Exception as e:
            print(f"\n💥 Error during dataset merging: {e}")
            import traceback
            traceback.print_exc()
            return False


def main():
    """Main execution function."""
    try:
        merger = SimplifiedDatasetMerger()
        success = merger.merge_datasets()
        return 0 if success else 1

    except Exception as e:
        print(f"Fatal error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit(main())
