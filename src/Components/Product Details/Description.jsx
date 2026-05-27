import React, { useState } from "react";
import DOMPurify from "dompurify";

const Description = ({ description, wordLimit = 20 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // sanitize description safely
    const sanitizedDesc = DOMPurify.sanitize(description || "");

    // split into words
    const words = sanitizedDesc.split(" ");
    const shortDesc = words.slice(0, wordLimit).join(" ") + (words.length > wordLimit ? "..." : "");

    return (
        <div className="text-secondary text-wrap text-justify">
            <div
                dangerouslySetInnerHTML={{
                    __html: isExpanded ? sanitizedDesc : shortDesc,
                }}
            />

            {words.length > wordLimit && (
                <button
                    className=" text-primary p-0 mt-1 text-decoration-none fw-medium"
                    type="button" style={{ fontSize: "12px" }}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? "Read Less ▲" : "Read More ▼"}
                </button>
            )}
        </div>
    );
};

export default Description;
