import { createTheme, lightThemePrimitives } from 'baseui'

export const Theme = createTheme(
  {
    ...lightThemePrimitives,
    // add all the properties here you'd like to override from the light theme primitives
    primaryFontFamily: '"Roboto Slab", Arial, sans-serif',
  },

  {
    // add all the theme overrides here - under the hood it uses deep merge
    animation: {
      timing100: '0.50s',
    }
  }
)
