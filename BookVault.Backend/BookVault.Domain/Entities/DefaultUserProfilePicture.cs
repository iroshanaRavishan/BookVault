using System.ComponentModel.DataAnnotations;

namespace BookVault.Domain.Entities
{
    public sealed class DefaultUserProfilePicture
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string FileName { get; set; }
        [Required]
        public string ContentType { get; set; }
        [Required]
        public byte[] Data { get; set; }

        private DefaultUserProfilePicture() { }

        private DefaultUserProfilePicture(Guid id, string fileName, string contentType, byte[] data)
        {
            Id = id;
            FileName = fileName;
            ContentType = contentType;
            Data = data;    
        }

        public static DefaultUserProfilePicture Create(string fileName, string contentType, byte[] data)
        {
            ValidateInputs(fileName, contentType, data);

            return new DefaultUserProfilePicture(Guid.NewGuid(), fileName, contentType, data);
        }

        private static void ValidateInputs(string fileName, string contentType, byte[] data)
        {
            if (string.IsNullOrWhiteSpace(fileName))
                throw new ArgumentException("File name cannot be empty.", nameof(fileName));

            if (string.IsNullOrWhiteSpace(contentType))
                throw new ArgumentException("Content type cannot be empty.", nameof(contentType));

            if (data == null || data.Length == 0)
                throw new ArgumentException("Data cannot be null or empty.", nameof(data));
        }
    }
}
