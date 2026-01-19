import CLIHelper from '../bin/support/cli-helper';
import { Arguments } from '../bin/support/arguments';

test('should fail if name was not provided', () => {
    const args = ['--langs=[en]', '--locales=[en-US]'];
    expect(CLIHelper.hasValidArguments(args)).toBe(false);
});

test('should validate arguments correctly with only name provided', () => {
    const args = ['--name=test'];
    expect(CLIHelper.hasValidArguments(args)).toBeTruthy();
});

test('should validate arguments correctly with all options provided', () => {
    const args = ['--name=test', '--langs=[en]', '--locales=[en-US]'];
    expect(CLIHelper.hasValidArguments(args)).toBeTruthy();
});

test('should invalidate arguments with unknown option', () => {
    const args = ['--name=test', '--unknown-option=value'];
    expect(CLIHelper.hasValidArguments(args)).toBe(false);
});

test('should invalidate arguments with missing required options (locales', () => {
    const args = ['--name=test', '--langs=[en]'];
    expect(CLIHelper.hasValidArguments(args)).toBe(false);
});

test('should invalidate arguments with missing required options (langs)', () => {
    const args = ['--name=test', '--locales=[en-US]'];
    expect(CLIHelper.hasValidArguments(args)).toBe(false);
});

test('should return Truthy value if provided without brackets but only one langs and one locales', () => {
    const args = ['--name=test', '--langs=de', '--locales=de-DE'];
    expect(CLIHelper.isLanguageAndLocaleSupported(args)).toBeTruthy();
});

test('should return Truthy value if provided without brackets and multiple langs and locales', () => {
    const args = ['--name=test', '--langs=de, en', '--locales=de-DE, en-US'];
    expect(CLIHelper.isLanguageAndLocaleSupported(args)).toBeTruthy();
});

test('should get argument value correctly', () => {
    const args = ['--name=test', '--langs=[en]', '--locales=[en-US]'];
    expect(CLIHelper.getArgumentValue(args, Arguments.ARGUMENT_NAME.arg)).toBe(
        'test',
    );
    expect(CLIHelper.getArgumentValue(args, Arguments.ARGUMENT_LANGS.arg)).toBe(
        '[en]',
    );
    expect(
        CLIHelper.getArgumentValue(args, Arguments.ARGUMENT_LOCALES.arg),
    ).toBe('[en-US]');
});

test('should validate language and locale support', () => {
    const args = ['--name=test', '--langs=[de]', '--locales=[de-DE]'];
    expect(CLIHelper.isLanguageAndLocaleSupported(args)).toStrictEqual({
        isValid: true,
        chosenLangs: ['de'],
        chosenLocales: ['de-DE'],
    });
});

test('should validate language and locale support (no arguments of langs and locales)', () => {
    const args = ['--name=test'];
    expect(CLIHelper.isLanguageAndLocaleSupported(args)).toStrictEqual({
        isValid: true,
        chosenLangs: ['en'],
        chosenLocales: ['en-US'],
    });
});

test('should invalidate language and locale support with unsupported language', () => {
    const args = ['--name=test', '--langs=[xx]', '--locales=[xx-XX]'];
    expect(CLIHelper.isLanguageAndLocaleSupported(args)).toStrictEqual({
        isValid: false,
    });
});

test('should invalidate language and locale support with unsupported locale', () => {
    const args = ['--name=test', '--langs=[en]', '--locales=[xx-XX]'];
    expect(CLIHelper.isLanguageAndLocaleSupported(args)).toStrictEqual({
        isValid: false,
    });
});

test('should invalidate language and locale support with different lengths', () => {
    const args = ['--name=test', '--langs=[en,fr]', '--locales=[en-US]'];
    expect(CLIHelper.isLanguageAndLocaleSupported(args)).toStrictEqual({
        isValid: false,
    });
});
