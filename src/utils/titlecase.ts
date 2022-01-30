import * as R from 'ramda'

export const titlecase = R.pipe(R.toLower, R.replace(/^./, R.toUpper))
