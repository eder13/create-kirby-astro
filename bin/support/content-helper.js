import fs from 'fs';
import Logger from './logger.js';
import CLIHelper from './cli-helper.js';

class ContentFileHelper {
    static replaceInFile(filePath, searchValue, replaceValue) {
        if (!fs.existsSync(filePath)) {
            CLIHelper.isVerboseModeEnabled() &&
                Logger.warn(
                    `Source does not exist for replacement, skipping: ${filePath}`,
                );
            return;
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const updatedContent = fileContent.replace(searchValue, replaceValue);
        fs.writeFileSync(filePath, updatedContent);
    }

    static readFile(filePath) {
        return fs.readFileSync(filePath, 'utf-8');
    }

    static writeFile(filePath, content, options = {}) {
        fs.writeFileSync(filePath, content, options);
    }
}

export default ContentFileHelper;
