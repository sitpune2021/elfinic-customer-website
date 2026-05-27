import DOMPurify from "dompurify";

export default function Dompurify({ addhtml }) {
    const cleanHTML = DOMPurify.sanitize(addhtml);
    return <span dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
}
