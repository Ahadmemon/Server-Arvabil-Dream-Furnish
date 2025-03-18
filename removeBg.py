import os
from rembg import remove
from PIL import Image

# Input folder (original images will be replaced)
input_folder = "/Users/abdulahadmemon/Desktop/FlutterDev/FlutterProjects/ArvabilDreamFurnish/arvabil/assets/arvabil_tables"

# Process all images in the input folder
for filename in os.listdir(input_folder):
    if filename.endswith((".png", ".jpg", ".jpeg")):
        input_path = os.path.join(input_folder, filename)

        # Open image and remove background
        with Image.open(input_path) as img:
            output = remove(img)
            output.save(input_path)  # Overwrites the original file

        print(f"✅ Processed & replaced: {filename}")

print("🎉 All images processed and replaced successfully!")