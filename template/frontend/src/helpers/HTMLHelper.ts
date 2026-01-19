const scriptOpeningTagRegEx = /<script[\s\S]*?>/gi;
const scriptClosingTagRegex = /<\/script[\s\S]*?>/gi;

export class HTMLHelper {
    static escapeXSSHtml(html: string | undefined) {
        if (!html) {
            return "";
        }

        const escaped = html.replace(scriptOpeningTagRegEx, "");
        return escaped.replace(scriptClosingTagRegex, "");
    }
}
