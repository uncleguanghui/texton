import {XText} from './XSelection';
import {StringUtils} from './StringUtils';

export class NodeUtils {

  public static readonly elesToSkip = {
    elements: [
      'applet',
      'area',
      'base',
      'basefont',
      'bdo',
      'button',
      'frame',
      'frameset',
      'iframe',
      'head',
      'hr',
      'img',
      'input',
      'link',
      'map',
      'meta',
      'noframes',
      'noscript',
      'optgroup',
      'option',
      'param',
      'script',
      'select',
      'style',
      'textarea',
      'title',
    ],

    /**
     * @param {Element} node
     * @param {string[]|null} list
     * @return {boolean}
     */
    test(node: Element, list: string[] | null): boolean {
      const elements = list || this.elements;
      return elements.indexOf(node.tagName.toLowerCase()) > -1;
    },
  };

  public static getValidTextNode(node: Node): XText | null {
    if (node.nodeType === 3 && /\S/.test((node as Text).data)) {
      return node as XText;
    } else if (node.nodeType === 1 && !NodeUtils.isSkipable(node as Element)) {
      for (let i = 0, len = node.childNodes.length; i < len; ++i) {
        const valid = NodeUtils.getValidTextNode(node.childNodes[i]);
        if (valid) {
          return valid;
        }
      }
    }
    return NodeUtils.getValidTextNode(node.nextSibling!);
  }

  public static getValidTextNodes(node: Node): XText[] {
    if (node.nodeType === 3 && /\S/.test((node as Text).data)) {
      return [node as XText];
    } else if (node.nodeType === 1 && !NodeUtils.isSkipable(node as Element)) {
      return Array.from(node.childNodes).reduce((nodes: XText[], child: Node) => {
        return nodes.concat(NodeUtils.getValidTextNodes(child));
      }, []);
    }
    return [];
  }

  public static isSkipable(node: Element): boolean {
    return NodeUtils.elesToSkip.test(node, null);
  }

  public static split(text: XText, offset: number): XText {
    const rp: XText = text.splitText(offset) as XText;
    rp.startPosition = text.startPosition + StringUtils.compact(text.data).length;
    rp.endPosition = text.endPosition;
    text.endPosition = rp.startPosition - 1;
    return rp;
  }

}