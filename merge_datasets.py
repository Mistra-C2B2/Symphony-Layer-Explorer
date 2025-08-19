#!/usr/bin/env python3
"""
Dataset Merging Script for Symphony Layers Explorer

This script merges multiple data files into optimized versions for the web application:
1. Merges layer metadata with availability indexes and improvement analysis
2. Creates combined data files for better performance
3. Copies files to the docs/data directory for the web application
"""

import json
import os
import shutil
from typing import Dict, List, Any


class DatasetMerger:
    def __init__(self):
        """Initialize the dataset merger."""
        self.data_dir = "data"
        self.output_dir = "docs/data"
        
        # Ensure output directory exists
        os.makedirs(self.output_dir, exist_ok=True)
        
        print("Initialized Dataset Merger")

    def load_json_file(self, file_path: str) -> Dict[str, Any]:
        """Load a JSON file and return its contents."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: {file_path} not found, skipping...")
            return {}
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON from {file_path}: {e}")
            return {}

    def create_enhanced_layer_metadata(self) -> Dict[str, Any]:
        """Create enhanced layer metadata with availability indexes and improvement analysis."""
        print("Creating enhanced layer metadata...")
        
        # Load source data
        symphony_metadata = self.load_json_file(os.path.join(self.data_dir, "symphony_layer_metadata.json"))
        availability_data = self.load_json_file(os.path.join(self.data_dir, "symphony_data_availability_index.json"))
        improvement_data = self.load_json_file(os.path.join(self.data_dir, "symphony_improvement_analysis.json"))
        
        # Extract availability indexes
        availability_indexes = {}
        if "layer_availability" in availability_data:
            for layer_name, data in availability_data["layer_availability"].items():
                availability_indexes[layer_name] = data["data_availability_index"]
        
        # Extract improvement analysis
        improvement_analysis = {}
        if "layer_analyses" in improvement_data:
            improvement_analysis = improvement_data["layer_analyses"]
        
        # Enhance metadata with additional data
        enhanced_metadata = []
        
        for entry in symphony_metadata:
            if isinstance(entry, dict) and "Name" in entry:
                layer_name = entry["Name"]
                
                # Skip schema entries
                if layer_name.startswith("The title of the data") or len(layer_name) > 100:
                    continue
                
                # Create enhanced entry
                enhanced_entry = entry.copy()
                
                # Add data availability index
                enhanced_entry["data_availability_index"] = availability_indexes.get(layer_name, 0.0)
                
                # Add improvement analysis
                if layer_name in improvement_analysis:
                    analysis = improvement_analysis[layer_name]
                    enhanced_entry["improvement_potential"] = analysis.get("improvement_potential", "medium")
                    enhanced_entry["improvement_difficulty"] = analysis.get("difficulty", "medium")
                    enhanced_entry["satellite_potential"] = analysis.get("satellite", False)
                else:
                    enhanced_entry["improvement_potential"] = "medium"
                    enhanced_entry["improvement_difficulty"] = "medium"
                    enhanced_entry["satellite_potential"] = False
                
                enhanced_metadata.append(enhanced_entry)
        
        print(f"Enhanced {len(enhanced_metadata)} layer metadata entries")
        return enhanced_metadata

    def copy_essential_files(self):
        """Copy essential files to the docs/data directory."""
        print("Copying essential files...")
        
        files_to_copy = [
            "symphony_layers.json",
            "reference_parameters.json", 
            "recommendation_parameters.json",
            "catalogue.json",
            "symphony_p02_matches.json"
        ]
        
        for filename in files_to_copy:
            src = os.path.join(self.data_dir, filename)
            dst = os.path.join(self.output_dir, filename)
            
            if os.path.exists(src):
                shutil.copy2(src, dst)
                print(f"  Copied {filename}")
            else:
                print(f"  Warning: {filename} not found in {self.data_dir}")

    def create_summary_statistics(self, enhanced_metadata: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create summary statistics for the enhanced metadata."""
        
        # Count improvement potentials
        improvement_counts = {"small": 0, "medium": 0, "large": 0}
        difficulty_counts = {"low": 0, "medium": 0, "high": 0}
        satellite_count = {"true": 0, "false": 0}
        availability_indexes = []
        
        for entry in enhanced_metadata:
            # Count improvement potential
            improvement = entry.get("improvement_potential", "medium")
            if improvement in improvement_counts:
                improvement_counts[improvement] += 1
            
            # Count difficulty
            difficulty = entry.get("improvement_difficulty", "medium")
            if difficulty in difficulty_counts:
                difficulty_counts[difficulty] += 1
            
            # Count satellite potential
            satellite = str(entry.get("satellite_potential", False)).lower()
            if satellite in satellite_count:
                satellite_count[satellite] += 1
            
            # Collect availability indexes
            availability = entry.get("data_availability_index", 0.0)
            if availability > 0:
                availability_indexes.append(availability)
        
        # Calculate availability statistics
        availability_stats = {}
        if availability_indexes:
            import statistics
            availability_stats = {
                "mean": round(statistics.mean(availability_indexes), 3),
                "median": round(statistics.median(availability_indexes), 3),
                "min": round(min(availability_indexes), 3),
                "max": round(max(availability_indexes), 3),
                "std_dev": round(statistics.stdev(availability_indexes), 3) if len(availability_indexes) > 1 else 0.0
            }
        
        return {
            "total_layers": len(enhanced_metadata),
            "improvement_potential": improvement_counts,
            "improvement_difficulty": difficulty_counts,
            "satellite_potential": satellite_count,
            "data_availability": availability_stats
        }

    def merge_datasets(self):
        """Main method to merge all datasets."""
        print("Starting dataset merging process...")
        
        # Create enhanced layer metadata
        enhanced_metadata = self.create_enhanced_layer_metadata()
        
        # Save enhanced metadata
        enhanced_metadata_file = os.path.join(self.output_dir, "symphony_layer_metadata.json")
        with open(enhanced_metadata_file, 'w', encoding='utf-8') as f:
            json.dump(enhanced_metadata, f, indent=2, ensure_ascii=False)
        print(f"Saved enhanced metadata to {enhanced_metadata_file}")
        
        # Create summary statistics
        summary_stats = self.create_summary_statistics(enhanced_metadata)
        summary_file = os.path.join(self.output_dir, "summary_statistics.json")
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(summary_stats, f, indent=2, ensure_ascii=False)
        print(f"Saved summary statistics to {summary_file}")
        
        # Copy essential files
        self.copy_essential_files()
        
        print("Dataset merging completed successfully!")
        print(f"Files are ready in {self.output_dir}/")
        
        # Print summary
        print(f"\nSummary:")
        print(f"  Enhanced layers: {summary_stats['total_layers']}")
        print(f"  Improvement potential: {summary_stats['improvement_potential']}")
        print(f"  Difficulty levels: {summary_stats['improvement_difficulty']}")
        print(f"  Satellite potential: {summary_stats['satellite_potential']}")
        if summary_stats['data_availability']:
            print(f"  Avg availability index: {summary_stats['data_availability']['mean']}")


def main():
    """Main execution function."""
    try:
        merger = DatasetMerger()
        merger.merge_datasets()
        return 0
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit(main())