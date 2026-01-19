import fs from 'fs';

class ContentFileHelper {
    static replaceInFile(filePath, searchValue, replaceValue) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const updatedContent = fileContent.replace(searchValue, replaceValue);
        fs.writeFileSync(filePath, updatedContent);
    }
}

export default ContentFileHelper;
