import React from 'react';
import Toolkit from './Toolkit';

/**
 * Example usage of the Toolkit component
 */
const ToolkitExample = () => {
    const shortText = "Hello World!";
    const longText = "This is a very long text that will be truncated when it exceeds the maximum length. Hover over it to see the full content in a beautiful tooltip!";
    const veryLongText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Toolkit Component Examples</h1>

            <div style={{ marginBottom: '30px' }}>
                <h3>Example 1: Short text with hover tooltip (enabled)</h3>
                <Toolkit
                    text={shortText}
                    showOnHover={true}
                />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h3>Example 2: Long text with hover tooltip (enabled)</h3>
                <Toolkit
                    text={longText}
                    showOnHover={true}
                    maxLength={50}
                />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h3>Example 3: Long text WITHOUT hover tooltip (disabled)</h3>
                <Toolkit
                    text={longText}
                    showOnHover={false}
                    maxLength={50}
                />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h3>Example 4: Very long text with custom max length</h3>
                <Toolkit
                    text={veryLongText}
                    showOnHover={true}
                    maxLength={80}
                />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h3>Example 5: Very long text with NO hover (showOnHover=false)</h3>
                <Toolkit
                    text={veryLongText}
                    showOnHover={false}
                    maxLength={60}
                />
            </div>

            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                <h3>Usage Guide:</h3>
                <ul>
                    <li><strong>text</strong>: The text to display</li>
                    <li><strong>showOnHover</strong>: Set to <code>true</code> to show tooltip on hover, <code>false</code> to disable tooltip</li>
                    <li><strong>maxLength</strong>: Maximum characters to show before truncating (default: 50)</li>
                    <li><strong>className</strong>: Additional CSS classes for custom styling</li>
                </ul>
            </div>
        </div>
    );
};

export default ToolkitExample;
