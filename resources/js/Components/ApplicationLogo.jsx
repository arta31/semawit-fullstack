export default function ApplicationLogo({ className, ...props }) {
    return (
        <img
            src="/images/image.png"
            alt="SEMAWIT"
            className={className}
            {...props}
        />
    );
}
