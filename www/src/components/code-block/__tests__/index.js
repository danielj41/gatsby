import React from "react"
import CodeBlock from ".."
import { fireEvent, render } from "react-testing-library"

beforeEach(() => {
  document.execCommand = jest.fn()
})

describe(`basic functionality`, () => {
  describe(`copy`, () => {
    it(`renders a copy button`, () => {
      const { queryByText } = render(
        <CodeBlock language="jsx">{`var a = 'b'`}</CodeBlock>
      )

      expect(queryByText(`copy`)).toBeDefined()
    })

    it(`copies text to clipboard`, () => {
      const text = `alert('hello world')`
      const { queryByText } = render(
        <CodeBlock language="jsx">{text}</CodeBlock>
      )

      const copyButton = queryByText(`Copy`)

      fireEvent.click(copyButton)

      expect(document.execCommand).toHaveBeenCalledWith(`copy`)
    })
  })

  describe(`highlighting`, () => {
    let instance
    const hidden = `var a = 'i will be hidden'`
    const highlighted = `
    <div>
      <h1>Oh shit waddup</h1>
    </div>
    `.trim()
    beforeEach(() => {
      const text = `
      import React from 'react'

      ${hidden} // hide-line

      export default function HelloWorld() {
        return (
          {/* highlight-start */}
          ${highlighted}
          {/* highlight-end */}
        )
      }
    `.trim()
      instance = render(<CodeBlock language="jsx">{text}</CodeBlock>)
    })

    it(`hides lines appropriately`, () => {
      expect(instance.queryByText(hidden)).toBeNull()
    })

    it(`highlights lines appropriately`, () => {
      const lines = highlighted.split(`\n`)
      expect(
        instance.container.querySelectorAll(`.gatsby-highlight-code-line`)
      ).toHaveLength(lines.length)
    })
  })
})
