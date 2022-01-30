export const keys = <O extends {}>(o: O) => Object.keys(o) as (keyof O)[]
