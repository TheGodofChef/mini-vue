import { readonly } from "../reactive"


describe('readonly', () => {
  it('happy path', () => {
    const original = {foo: 1, bar: {baz: 2}}
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
  })

  it('when then call set', () => {
    const user = readonly({age: 10})
    user.age = 11
  })
})