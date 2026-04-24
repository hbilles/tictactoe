import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CellSymbol from './CellSymbol.vue'

describe('CellSymbol', () => {
  it('renders the circle glyph for value -1', () => {
    const wrapper = mount(CellSymbol, { props: { index: 0, value: -1 } })
    const use = wrapper.find('use')
    expect(use.exists()).toBe(true)
    const href = use.attributes('xlink:href') || use.attributes('href')
    expect(href).toBe('#icon--circle')
    expect(wrapper.find('.ttt-symbol').attributes('style')).toContain('75, 255, 75')
  })

  it('renders the x glyph for value 1', () => {
    const wrapper = mount(CellSymbol, { props: { index: 0, value: 1 } })
    const use = wrapper.find('use')
    expect(use.exists()).toBe(true)
    const href = use.attributes('xlink:href') || use.attributes('href')
    expect(href).toBe('#icon--x')
    expect(wrapper.find('.ttt-symbol').attributes('style')).toContain('5, 5, 255')
  })

  it('renders no glyph for value 0', () => {
    const wrapper = mount(CellSymbol, { props: { index: 0, value: 0 } })
    expect(wrapper.find('use').exists()).toBe(false)
  })
})
