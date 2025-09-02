#!/bin/sh

# Video conversion script for Docker build
# Converts .MOV files to .mp4 for better web compatibility

echo "🎬 Starting video conversion..."

PUBLIC_DIR="./public"

# Check if public directory exists
if [ ! -d "$PUBLIC_DIR" ]; then
    echo "❌ Public directory not found: $PUBLIC_DIR"
    exit 1
fi

# Find and convert .MOV files
converted_count=0

for mov_file in "$PUBLIC_DIR"/*.MOV "$PUBLIC_DIR"/*.mov; do
    # Check if file exists (handles case where no .MOV files exist)
    [ -f "$mov_file" ] || continue
    
    # Get filename without extension
    basename=$(basename "$mov_file")
    filename_no_ext="${basename%.*}"
    mp4_file="$PUBLIC_DIR/${filename_no_ext}.mp4"
    
    echo "🔄 Converting: $basename → ${filename_no_ext}.mp4"
    
    # Convert with web-optimized settings
    if ffmpeg -i "$mov_file" \
        -c:v libx264 \
        -c:a aac \
        -crf 23 \
        -preset medium \
        -movflags +faststart \
        -pix_fmt yuv420p \
        -y "$mp4_file"; then
        
        echo "✅ Successfully converted: ${filename_no_ext}.mp4"
        
        # Remove original .MOV file to save space
        rm "$mov_file"
        echo "🗑️  Removed original: $basename"
        
        converted_count=$((converted_count + 1))
    else
        echo "❌ Failed to convert: $basename"
    fi
done

if [ $converted_count -eq 0 ]; then
    echo "ℹ️  No .MOV files found to convert"
else
    echo "🎉 Converted $converted_count video file(s) successfully!"
fi

echo "✨ Video conversion complete!"