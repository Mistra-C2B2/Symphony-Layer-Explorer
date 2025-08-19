#!/usr/bin/env python3
"""
Optimization script for the Symphony Layers static website
"""

import json
import os
import gzip
import shutil
from pathlib import Path

def optimize_json_files():
    """Minify JSON files to reduce size"""
    docs_data_dir = Path("docs/data")
    
    if not docs_data_dir.exists():
        print("Error: docs/data directory not found")
        return
    
    total_original = 0
    total_optimized = 0
    
    for json_file in docs_data_dir.glob("*.json"):
        print(f"Optimizing {json_file.name}...")
        
        # Read original file
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Get original size
        original_size = json_file.stat().st_size
        total_original += original_size
        
        # Write minified version
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, separators=(',', ':'), ensure_ascii=False)
        
        # Get optimized size
        optimized_size = json_file.stat().st_size
        total_optimized += optimized_size
        
        reduction = ((original_size - optimized_size) / original_size) * 100
        print(f"  {json_file.name}: {original_size:,} → {optimized_size:,} bytes ({reduction:.1f}% reduction)")
    
    total_reduction = ((total_original - total_optimized) / total_original) * 100
    print(f"\nTotal JSON optimization: {total_original:,} → {total_optimized:,} bytes ({total_reduction:.1f}% reduction)")

def create_gzip_versions():
    """Create gzipped versions of static files for better compression"""
    docs_dir = Path("docs")
    
    files_to_gzip = [
        "index.html",
        "css/styles.css",
        "js/app.js",
        "js/data-loader.js"
    ]
    
    for file_path in files_to_gzip:
        full_path = docs_dir / file_path
        if full_path.exists():
            print(f"Creating gzip version of {file_path}...")
            
            with open(full_path, 'rb') as f_in:
                with gzip.open(f"{full_path}.gz", 'wb') as f_out:
                    shutil.copyfileobj(f_in, f_out)
            
            original_size = full_path.stat().st_size
            gzip_size = Path(f"{full_path}.gz").stat().st_size
            reduction = ((original_size - gzip_size) / original_size) * 100
            
            print(f"  {file_path}: {original_size:,} → {gzip_size:,} bytes ({reduction:.1f}% reduction)")

def validate_website_structure():
    """Validate that all required files are present"""
    docs_dir = Path("docs")
    
    required_files = [
        "index.html",
        "css/styles.css",
        "js/app.js",
        "js/data-loader.js",
        "data/symphony_layers.json",
        "data/reference_parameters.json",
        "data/recommendation_parameters.json",
        "data/catalogue.json"
    ]
    
    missing_files = []
    for file_path in required_files:
        full_path = docs_dir / file_path
        if not full_path.exists():
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ Missing required files:")
        for file_path in missing_files:
            print(f"  - {file_path}")
        return False
    else:
        print("✅ All required files are present")
        return True

def generate_site_stats():
    """Generate statistics about the website"""
    docs_dir = Path("docs")
    
    stats = {
        'total_files': 0,
        'total_size': 0,
        'file_types': {}
    }
    
    for file_path in docs_dir.rglob("*"):
        if file_path.is_file() and not file_path.name.startswith('.'):
            stats['total_files'] += 1
            file_size = file_path.stat().st_size
            stats['total_size'] += file_size
            
            extension = file_path.suffix.lower()
            if extension not in stats['file_types']:
                stats['file_types'][extension] = {'count': 0, 'size': 0}
            
            stats['file_types'][extension]['count'] += 1
            stats['file_types'][extension]['size'] += file_size
    
    print(f"\n📊 Website Statistics:")
    print(f"Total files: {stats['total_files']}")
    print(f"Total size: {stats['total_size']:,} bytes ({stats['total_size']/1024/1024:.2f} MB)")
    
    print(f"\nFile types:")
    for ext, info in sorted(stats['file_types'].items()):
        avg_size = info['size'] / info['count']
        print(f"  {ext or '(no ext)'}: {info['count']} files, {info['size']:,} bytes (avg: {avg_size:,.0f} bytes)")

def main():
    print("🚀 Optimizing Symphony Layers Static Website")
    print("=" * 50)
    
    # Validate structure
    if not validate_website_structure():
        print("❌ Cannot proceed with optimization due to missing files")
        return
    
    # Optimize JSON files
    print("\n📦 Optimizing JSON data files...")
    optimize_json_files()
    
    # Create gzip versions
    print("\n🗜️ Creating gzipped versions...")
    create_gzip_versions()
    
    # Generate statistics
    print("\n📊 Generating site statistics...")
    generate_site_stats()
    
    print("\n✅ Website optimization complete!")
    print("\nThe static website is ready for deployment to GitHub Pages.")
    print("To deploy:")
    print("1. Commit all files in the docs/ directory")
    print("2. Enable GitHub Pages in repository settings") 
    print("3. Select 'Deploy from a branch' and choose 'main' branch, '/docs' folder")
    print("4. Your site will be available at: https://yourusername.github.io/repository-name/")

if __name__ == "__main__":
    main()