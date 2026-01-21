export type QuoteBlock = {
    type: "quote";
    id: string;
    quoteText: QuoteText;
    quoteCitation: QuoteCitation;
};

type QuoteText = {
    value: string;
};

type QuoteCitation = {
    value: string;
};
