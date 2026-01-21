import fs from 'fs';
import path from 'path';

class FileTransferHelper {
    static copyFileOrFolder(src, dest, isFolder = false) {
        if (isFolder) {
            fs.mkdirSync(dest, { recursive: true });
            fs.cpSync(src, dest, { recursive: true });
        } else {
            fs.mkdirSync(dest, { recursive: true });
            const destFile = path.join(dest, path.basename(src));
            fs.copyFileSync(src, destFile);
        }
    }

    static copyFileToFile(src, dest) {
        fs.copyFileSync(src, dest);
    }

    static removeFileOrFolder(src, isFolder = false) {
        if (fs.existsSync(src)) {
            if (isFolder) {
                fs.rmSync(src, { recursive: true, force: true });
            } else {
                fs.unlinkSync(src);
            }
        }
    }

    static fileOrFolderExists(filePath) {
        return fs.existsSync(filePath);
    }

    static renameFileOrFolder(oldPath, newPath) {
        fs.renameSync(oldPath, newPath);
    }

    static createFileOrFolder(filePath, isFolder = false) {
        if (isFolder) {
            fs.mkdirSync(filePath);
        } else {
            fs.writeFileSync(filePath, '');
        }
    }

    static listTree(dir, list = []) {
        const absDir = path.resolve(process.cwd(), dir);
        const entries = fs.readdirSync(absDir, { withFileTypes: true });

        for (const entry of entries) {
            const absPath = path.join(absDir, entry.name);
            const relPath = path.relative(process.cwd(), absPath);

            if (entry.isDirectory()) {
                FileTransferHelper.listTree(relPath, list);
            } else {
                list.push(relPath);
            }
        }
    }
}

export default FileTransferHelper;
