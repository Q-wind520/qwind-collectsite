/** Wrap Markdown tables so wide tables scroll inside their own container. */
export function rehypeTableWrap() {
  const walk = (node) => {
    if (!Array.isArray(node.children)) return;
    node.children = node.children.map((child) => {
      walk(child);
      if (child.type === 'element' && child.tagName === 'table') {
        return {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-wrap'] },
          children: [child],
        };
      }
      return child;
    });
  };

  return (tree) => walk(tree);
}
