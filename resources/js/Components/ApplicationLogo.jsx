export default function ApplicationLogo({ className, ...props }) {
    return (
        <img
            src="/images/logo.jpeg"
            alt="SEMAWIT"
            className={className}
            {...props}
        />
    );
}
