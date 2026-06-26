export default function Avatar({ src, alt = "Avatar", size = "w-10", ring = "ring-primary" }) {
    return (
        <div className="avatar">
            <div className={`${ring} ring-offset-base-100 ${size} rounded-full ring-2 ring-offset-2 overflow-hidden`}>
                <img src={src} alt={alt} className="w-full h-full object-cover" />
            </div>
        </div>
    );
}