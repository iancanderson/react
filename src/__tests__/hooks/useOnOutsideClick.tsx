import {useOnOutsideClick} from '../../hooks/useOnOutsideClick'
import {render} from '@testing-library/react'
import React, {useRef} from 'react'
import userEvent from '@testing-library/user-event'

type ComponentProps = {
  callback: () => void
}
const Component = ({callback}: ComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const outerButton = useRef<HTMLButtonElement>(null)
  const secondButton = useRef<HTMLButtonElement>(null)
  useOnOutsideClick({ignoreClickRefs: [secondButton], containerRef, onClickOutside: callback})
  return (
    <div>
      <button ref={outerButton}>button</button>
      <button ref={secondButton}>button two</button>
      <div ref={containerRef}>content</div>
    </div>
  )
}
it('should call function when user clicks outside container', () => {
  const mockFunction = jest.fn()
  const {getByText} = render(<Component callback={mockFunction} />)
  userEvent.click(getByText('button'))
  expect(mockFunction).toHaveBeenCalledTimes(1)
})

it('should not call function when user right clicks', () => {
  const mockFunction = jest.fn()
  const {getByText} = render(<Component callback={mockFunction} />)
  userEvent.click(getByText('button'), {button: 1})
  expect(mockFunction).toHaveBeenCalledTimes(0)
})

it('should not call function when clicking on ignored refs', () => {
  const mockFunction = jest.fn()
  const {getByText} = render(<Component callback={mockFunction} />)
  userEvent.click(getByText('button two'))
  expect(mockFunction).toHaveBeenCalledTimes(0)
})

it('should not call function when clicking inside container', () => {
  const mockFunction = jest.fn()
  const {getByText} = render(<Component callback={mockFunction} />)
  userEvent.click(getByText('content'))
  expect(mockFunction).toHaveBeenCalledTimes(0)
})
