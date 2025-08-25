#!/usr/bin/env python3
"""
Test script for improved analysis criteria
"""

import json
import os
import sys

def main():
    """Show the improvement in prompt criteria"""
    
    # Load current analysis results 
    try:
        with open('data/symphony_improvement_analysis.json', 'r') as f:
            current_data = json.load(f)
    except FileNotFoundError:
        print("Error: symphony_improvement_analysis.json not found")
        return
    
    layer_analyses = current_data.get('layer_analyses', {})
    
    print("=== ANALYSIS OF CURRENT SCORING BIAS ===")
    print()
    
    # Count current distributions
    improvement_counts = {'small': 0, 'medium': 0, 'large': 0}
    difficulty_counts = {'low': 0, 'medium': 0, 'high': 0}
    
    for layer_name, analysis in layer_analyses.items():
        improvement = analysis.get('improvement_potential', 'unknown')
        difficulty = analysis.get('difficulty', 'unknown')
        
        if improvement in improvement_counts:
            improvement_counts[improvement] += 1
        if difficulty in difficulty_counts:
            difficulty_counts[difficulty] += 1
    
    total = len(layer_analyses)
    print(f"Current Distribution ({total} layers):")
    print("Improvement Potential:")
    for level, count in improvement_counts.items():
        percentage = (count / total) * 100 if total > 0 else 0
        print(f"  {level}: {count} ({percentage:.1f}%)")
    
    print("\nDifficulty:")
    for level, count in difficulty_counts.items():
        percentage = (count / total) * 100 if total > 0 else 0
        print(f"  {level}: {count} ({percentage:.1f}%)")
    
    print("\n=== RECOMMENDED TARGET DISTRIBUTION ===")
    print("Improvement Potential:")
    print("  small: ~20-25% (15-20 layers)")
    print("  medium: ~45-55% (35-40 layers)")  
    print("  large: ~20-30% (15-25 layers)")
    
    print("\nDifficulty:")
    print("  low: ~20-30% (15-25 layers)")
    print("  medium: ~40-50% (30-40 layers)")
    print("  high: ~20-30% (15-25 layers)")
    
    print("\n=== LIKELY CANDIDATES FOR RE-SCORING ===")
    
    # Find layers with "no limitations" that were scored as large
    print("\nLayers with 'No limitations' currently scored as LARGE (likely candidates for SMALL):")
    no_limits_large = 0
    for name, analysis in layer_analyses.items():
        if analysis.get('improvement_potential') == 'large':
            reasoning = analysis.get('reasoning', {}).get('improvement_justification', '')
            if ('No limitations' in reasoning or 'states \"None\"' in reasoning or 
                'No recommendations' in reasoning):
                print(f"  - {name}")
                no_limits_large += 1
                if no_limits_large >= 5:  # Limit output
                    break
    
    print(f"\n{no_limits_large}+ layers found that could potentially be re-scored as SMALL.")
    print("\nTo implement the fix:")
    print("1. The analyze_layer_improvements.py script has been updated with revised criteria")
    print("2. Run: python analyze_layer_improvements.py")
    print("3. This will regenerate the analysis with better distribution")
    print("4. Then run: python merge_datasets.py to update the web app data")

if __name__ == "__main__":
    main()