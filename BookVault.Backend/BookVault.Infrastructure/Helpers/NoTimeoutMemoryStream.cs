using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookVault.Infrastructure.Helpers
{
    public class NoTimeoutMemoryStream : MemoryStream
    {
        public override bool CanTimeout => false;

        public override int ReadTimeout
        {
            get => throw new InvalidOperationException();
            set { }
        }

        public override int WriteTimeout
        {
            get => throw new InvalidOperationException();
            set { }
        }

        public NoTimeoutMemoryStream() : base()
        {
        }

        public NoTimeoutMemoryStream(byte[] buffer) : base(buffer)
        {
        }
    }
}
