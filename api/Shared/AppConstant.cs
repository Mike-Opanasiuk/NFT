namespace Shared;

public class AppConstant
{
    public static class General
    {
        /// <summary>
        /// path to NLog config file to configure logging
        /// </summary>
        public const string NLogConfigPath = "Logging/nlog.config";
    }

    public static class Length
    {
        public const int L1 = 64;
        public const int L2 = 256;
        public const int L3 = 512;
        public const int L4 = 2048;
        public const int L5 = 4096;
    }

    public record Roles
    {
        public const string User = "User";
    }


    /// <summary>
    /// jwt token lifetimes
    /// </summary>
    public static class JwtTokenLifetimes
    {
        /// <summary>
        /// 12 hours
        /// </summary>
        public static readonly TimeSpan Default = TimeSpan.FromHours(12);
        /// <summary>
        /// 7 days
        /// </summary>
        public static readonly TimeSpan Longer = TimeSpan.FromDays(7);
    }
}