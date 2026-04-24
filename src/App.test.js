import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from './App.vue'

describe('App', () => {
  it('plays a human move then a computer move on click', async () => {
    const wrapper = mount(App)
    await flushPromises()

    const cells = wrapper.findAll('.bg-black\\/10')
    expect(cells).toHaveLength(9)

    await cells[0].trigger('click')
    await flushPromises()

    const state = wrapper.vm.gameState
    expect(state[0]).toBe(-1)

    const computerMoves = state.filter((v) => v === 1)
    expect(computerMoves).toHaveLength(1)
  })

  it('reset("other") flips the starting player and empties the board', async () => {
    const wrapper = mount(App)
    await flushPromises()

    const cells = wrapper.findAll('.bg-black\\/10')
    await cells[0].trigger('click')
    await flushPromises()

    const initialStartingPlayer = wrapper.vm.startingPlayer
    await wrapper.vm.reset('other')
    await flushPromises()

    expect(wrapper.vm.startingPlayer).toBe(initialStartingPlayer * -1)
    const nonEmpty = wrapper.vm.gameState.filter((v) => v !== 0).length
    // after reset, if computer starts, there will be 1 move; if human starts, 0 moves.
    expect([0, 1]).toContain(nonEmpty)
  })

  it('clicking an already-taken cell is a no-op', async () => {
    const wrapper = mount(App)
    await flushPromises()

    const cells = wrapper.findAll('.bg-black\\/10')
    await cells[0].trigger('click')
    await flushPromises()

    const snapshot = [...wrapper.vm.gameState]
    await cells[0].trigger('click')
    await flushPromises()

    expect(wrapper.vm.gameState).toEqual(snapshot)
  })
})
