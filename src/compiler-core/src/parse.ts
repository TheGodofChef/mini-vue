import { NodeTypes } from "./ast"

const enum TagType {
  Start,
  End
}

export function baseParse(content: string) {
  const context = createParserContext(content)
  return createRoot(parseChildren(context, []))
}

function parseChildren(context, ancestors) {
  const nodes: any = []

  while(!isEnd(context, ancestors)) {
    let node
    const s = context.source
    if(s.startsWith("{{")) {
      node = parseInterpolation(context)
    } else if(s.startsWith("<")) {
      if(/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors)
      }
    }

    if(!node) {
      node = parseText(context)
    }

    nodes.push(node)
  }
}

function isEnd(context, ancestors) {
  const s = context.source
  if(s.startsWith("</")) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const tag = ancestors[i].tag;
      if(startsWithEndTagOpen(s, tag)) {
        return true
      }
    }
  }
  return !context.source
}

function parseText(context: any) {

  let endTokens = ["{{", "<"]
  let endIndex = context.source.length

  for(let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i])
    if(index !== -1 && endIndex > index) {
      endIndex = index
    }
  }

  const content = parseTextData(context, endIndex)

  return {
    type: NodeTypes.TEXT,
    content
  }
}

function parseTextData(context: any, length) {
  const content = context.source.slice(0, length)
  advanceBy(context, length)
  return content
}

function parseElement(context: any, ancestors) {
  const element: any = parseTag(context, TagType.Start)
  ancestors.push(element)
  element.children = parseChildren(context, ancestors)
  ancestors.pop()

  if(startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End)
  } else {
    throw new Error(`缺少结束标签:${element.tag}`)
  }

  return element
}

function startsWithEndTagOpen(source, tag) {
  return source.startsWith("</") && source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
}

function parseTag(context: any, type: TagType) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source)
  const tag = match[1]

  advanceBy(context, match[0].length)
  advanceBy(context, 1)

  if(type === TagType.End) return
  return {
    type: NodeTypes.ELEMENT,
    tag
  }
}

function parseInterpolation(context) {
  const openDelimiter = "{{"
  const closeDelimiter = "}}"

  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)
  advanceBy(context, openDelimiter.length)

  const rawContentLength = closeIndex - openDelimiter.length
  const rawContent = parseTextData(context, rawContentLength)
  const content = rawContent.trim()

  advanceBy(context, rawContentLength + closeDelimiter.length)

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      content
    }
  }
}

function advanceBy(context: any, length: number) {
  context.source = context.source.slice(length)
}

function createRoot(children: any) {
  return {
    children,
    type: NodeTypes.ROOT
  }
}

function createParserContext(content: string): any {
  return {
    source: content
  }
}