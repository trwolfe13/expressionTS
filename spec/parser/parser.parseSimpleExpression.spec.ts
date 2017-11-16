import { ParseResult } from '../../src/parser/parse-result';
import { NodeType } from '../../src/ast/node-type';
import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { MockLexer } from '../helpers/mock-lexer';

describe('Parser', () => {
    describe('parseExpression', () => {
        it('can correctly parse a simple addition', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Number, 0, '10'),
                new Token(TokenType.Plus, 2, '+'),
                new Token(TokenType.Number, 3, '6')
            ]);
            const parser = new Parser.Parser(lexer);
            const result = new ParseResult();
            const exp = parser.parseExpression(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Add);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Number);
            expect(exp.getChild(0).value).toBe(10);
            expect(exp.getChild(1).type).toBe(NodeType.Number);
            expect(exp.getChild(1).value).toBe(6);
        });
        it('can correctly parse a simple subtraction', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Number, 0, '10'),
                new Token(TokenType.Minus, 2, '-'),
                new Token(TokenType.Number, 3, '6')
            ]);
            const parser = new Parser.Parser(lexer);
            const result = new ParseResult();
            const exp = parser.parseExpression(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Subtract);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Number);
            expect(exp.getChild(0).value).toBe(10);
            expect(exp.getChild(1).type).toBe(NodeType.Number);
            expect(exp.getChild(1).value).toBe(6);
        });
        it('can correctly parse a simple negation', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Minus, 0, '-'),
                new Token(TokenType.Number, 1, '4')
            ]);
            const parser = new Parser.Parser(lexer);
            const result = new ParseResult();
            const exp = parser.parseExpression(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Negate);
            expect(exp.getChildCount()).toBe(1);
            expect(exp.getChild(0).type).toBe(NodeType.Number);
            expect(exp.getChild(0).value).toBe(4);
        });
        it('can correctly parse multiple operators', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Number, 0, '4'),
                new Token(TokenType.Plus, 1, '+'),
                new Token(TokenType.Number, 2, '3'),
                new Token(TokenType.Minus, 3, '-'),
                new Token(TokenType.Number, 4, '1')
            ]);
            const parser = new Parser.Parser(lexer);
            const result = new ParseResult();
            const exp = parser.parseExpression(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Subtract);
            expect(exp.getChildCount()).toBe(2);

            const lhs = exp.getChild(0);
            expect(lhs.type).toBe(NodeType.Add);
            expect(lhs.getChildCount()).toBe(2);
            expect(lhs.getChild(0).type).toBe(NodeType.Number);
            expect(lhs.getChild(0).value).toBe(4);
            expect(lhs.getChild(1).type).toBe(NodeType.Number);
            expect(lhs.getChild(1).value).toBe(3);

            const rhs = exp.getChild(1);
            expect(rhs.type).toBe(NodeType.Number);
            expect(rhs.value).toBe(1);
        });
        it('correctly handles operator precedence (10 * 5 + 2)', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Number, 0, '10'),
                new Token(TokenType.Asterisk, 2, '*'),
                new Token(TokenType.Number, 3, '5'),
                new Token(TokenType.Plus, 4, '+'),
                new Token(TokenType.Number, 5, '2'),
            ]);
            const parser = new Parser.Parser(lexer);
            const result = new ParseResult();
            const exp = parser.parseExpression(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Add);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Multiply);
            expect(exp.getChild(1).type).toBe(NodeType.Number);
            expect(exp.getChild(1).value).toBe(2);
        });
    });
});
