import * as td from 'typedoc';

// remap property declaration to method if type is callable
export function load(app) {
  app.converter.on('createDeclaration', (context, reflection) => {
    if (reflection.kind === td.ReflectionKind.Property) {
      const sigs = reflection.type?.declaration?.signatures;
      if (sigs && sigs.length && sigs.some((sig) => sig.kind === td.ReflectionKind.CallSignature)) {
        reflection.kind = td.ReflectionKind.Method;
        reflection.signatures = sigs;
      }
    }
  });
}
