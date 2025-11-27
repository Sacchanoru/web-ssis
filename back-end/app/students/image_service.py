from io import BytesIO
from PIL import Image, ImageOps
from app.supabase_client import supabase

class ImageService:
    BUCKET_NAME = "student-images"
    
    @staticmethod
    def upload_student_image(student_id: str, file):
        try:
            file_bytes = file.read()
            img = Image.open(BytesIO(file_bytes))
            if img.mode != 'RGB':
                img = img.convert('RGB')
            img = ImageOps.fit(img, (500, 500), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
            output_bytes = BytesIO()
            img.save(output_bytes, format='JPEG', quality=85, optimize=True)
            output_bytes.seek(0)

            file_path = f"students/{student_id}.jpg"
            supabase.storage.from_(ImageService.BUCKET_NAME).upload(
                file_path,
                output_bytes.getvalue(),
                file_options={
                    "content-type": "image/jpeg",
                    "upsert": "true"
                }
            )

            public_url_data = supabase.storage.from_(ImageService.BUCKET_NAME).get_public_url(file_path)
            supabase_public_url = public_url_data

            existing = supabase.table("student_images").select("*").eq("student_id", student_id).execute()
            
            if existing.data:
                supabase.table("student_images").update({
                    "supabase_path": file_path,
                    "supabase_public_url": supabase_public_url,
                }).eq("student_id", student_id).execute()
            else:
                supabase.table("student_images").insert({
                    "student_id": student_id,
                    "supabase_path": file_path,
                    "supabase_public_url": supabase_public_url,
                }).execute()
            
            return {
                "supabase_path": file_path,
                "supabase_public_url": supabase_public_url,
                "message": "Image uploaded successfully"
            }
            
        except Exception as e:
            raise Exception(f"Image upload failed: {str(e)}")
    
    @staticmethod
    def get_student_image(student_id: str):
        try:
            result = supabase.table("student_images").select("*").eq("student_id", student_id).execute()
            
            if result.data:
                return result.data[0]
            return None
            
        except Exception as e:
            print(f"Error fetching image: {str(e)}")
            return None
    
    @staticmethod
    def delete_student_image(student_id: str):
        try:
            image_record = ImageService.get_student_image(student_id)
            
            if not image_record:
                return True
            
            supabase_path = image_record['supabase_path']
            try:
                supabase.storage.from_(ImageService.BUCKET_NAME).remove([supabase_path])
            except Exception as e:
                print(f"Warning: Could not delete file from storage: {str(e)}")
            supabase.table("student_images").delete().eq("student_id", student_id).execute()
            
            return True
            
        except Exception as e:
            print(f"Error deleting image: {str(e)}")
            return False
    
    @staticmethod
    def update_student_image(student_id: str, file):
        try:
            ImageService.delete_student_image(student_id)
            return ImageService.upload_student_image(student_id, file)
            
        except Exception as e:
            raise Exception(f"Image update failed: {str(e)}")