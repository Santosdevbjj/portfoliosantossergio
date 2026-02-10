

TypeScript Documentation


https://www.typescriptlang.org/pt/docs/

Pular para o conteúdo principal
TypeScript Documentation
Get Started
Quick introductions based on your background or preference.

TS para o Novo Programador
TypeScript para programadores JavaScript
TS para programadores Java/C#
TS para Programadores Funcionais
Ferramentas TypeScript em 5 minutos
Handbook
A great first read for your daily TS work.

The TypeScript Handbook
The Basics
Everyday Types
Narrowing
More on Functions
Object Types
Type Manipulation
Creating Types from Types
Generics
Keyof Type Operator
Typeof Type Operator
Indexed Access Types
Conditional Types
Mapped Types
Template Literal Types
Classes
Modules
Reference
Deep dive reference materials.

Tipos Utilitários
Cheat Sheets
Decoradores
Fusão de Declarações
Enums
Iteradores e Geradores
JSX
Mixins
Namespaces
Namespaces e Módulos
Símbolos (Symbols)
Diretivas de barra tripla
Compatibilidade de Tipos
Inferência de Tipo
Declarações de variáveis
Modules Reference
How TypeScript models JavaScript modules.

Introduction
Theory
Guides
Choosing Compiler Options
Reference
Appendices
ESM/CJS Interoperability
Tutorials
Using TypeScript in several environments.

ASP.NET Core
Gulp
Manipulação do DOM
Migrating from JavaScript
Usando Babel com TypeScript
Declaration Files
Learn how to write declaration files to describe existing JavaScript. Important for DefinitelyTyped contributions.

Introdução
Declaration Reference
Library Structures
.d.ts Templates
Modules .d.ts
Module: Plugin
Module: Class
Module: Function
Global .d.ts
Global: Módulo de modificação
Do's and Don'ts
Análise profunda
Publishing
Consumption
JavaScript
How to use TypeScript-powered JavaScript tooling.

Projetos JS utilizando TypeScript
Checando tipos de arquivos JavaScript
Referência JSDoc
Criação de arquivos .d.ts a partir de arquivos .js
Project Configuration
Compiler configuration reference.

tsconfig.json
Compiler Options in MSBuild
TSConfig Reference
tsc CLI Options
Referência de Projeto
Integrating with Build Tools
Configurando Watch
Compilação Noturna
Cheat Sheets
Downloadable syntax reference pages for different parts of everyday TypeScript code.

Control Flow Analysis
Classes
Interfaces
Types
Download PDFs and PNGs
Recursos para estudo
Get Started
JS to TS
New to Programming
OOP to JS
Functional to JS
Installation
Handbook
Everyday Types
Creating Types from Types
Object Types
Variable Declarations
More on Functions
Tools
Playground
TSConfig Reference
Release Notes
What's new in 5.9
Tutorials
ASP.NET
Migrating from JS
Working with the DOM
React & Webpack
Customize
Site Colours:

Code Font:

Popular Documentation Pages
Everyday Types
All of the common types in TypeScript

Creating Types from Types
Techniques to make more elegant types

More on Functions
How to provide types to functions in JavaScript

More on Objects
How to provide a type shape to JavaScript objects

Narrowing
How TypeScript infers types based on runtime behavior

Variable Declarations
How to create and type JavaScript variables

TypeScript in 5 minutes
An overview of building a TypeScript web app

TSConfig Options
All the configuration options for a project

Classes
How to provide types to JavaScript ES6 classes

Made with ♥ in Redmond, Boston, SF & Dublin

Microsoft Logo
© 2012-2026 Microsoft
PrivacyTerms of Use

Using TypeScript
Get Started
Download
Community
Playground
TSConfig Ref
Code Samples
Why TypeScript
Design
Community
Get Help
Blog
GitHub Repo
Community Chat
@TypeScript
Mastodon
Stack Overflow
Web Repo







manual completo do TypeScript 5.9



https://devblogs.microsoft.com/typescript/announcing-typescript-5-9/



O TypeScript 5.9, lançado em agosto de 2025, foca em aprimorar a experiência do desenvolvedor (DX), melhorar o desempenho em grandes projetos e simplificar a configuração



. Esta versão traz melhorias notáveis na velocidade de compilação, novas funcionalidades de importação e uma configuração padrão mais moderna. 
Aqui está um manual completo das principais novidades e funcionalidades do TypeScript 5.9:
1. Novidades no tsconfig.json (tsc --init) 
A execução de tsc --init agora gera um arquivo muito mais enxuto e moderno, focado em práticas atuais, sem o excesso de comentários das versões anteriores. 
Melhores padrões: O novo padrão inclui "strict": true, "module": "nodenext", "target": "esnext", "jsx": "react-jsx" e "verbatimModuleSyntax": true.
Foco em Módulos: moduleDetection é definido como force para tratar todos os arquivos como módulos. 
2. Importações Diferidas (import defer)
O TypeScript 5.9 introduz suporte à proposta ECMAScript de deferred module evaluation (avaliação de módulo diferida) usando import defer. 
O que faz: Permite importar um módulo sem executá-lo imediatamente. O código do módulo só é executado quando um de seus membros é acessado.
Sintaxe: Apenas import defer * as namespace é suportado.
typescript
import defer * as analytics from "./heavy-analytics.js";
// O arquivo 'heavy-analytics.js' não foi executado ainda.
if (userConsent) {
    analytics.track(); // O módulo é executado agora.
}
Vantagem: Melhora o tempo de inicialização (startup) de aplicações, ideal para carregar bibliotecas pesadas de forma condicional. 
3. Novo modo --module node20 
Para desenvolvedores Node.js, foi adicionada uma configuração estável para Node.js v20. 
--module node20: Modela o comportamento do Node.js 20, com target padrão em es2023.
Vantagem: Oferece maior estabilidade em comparação com nodenext ou node18, que evoluem com as novas versões do Node. 
4. Melhorias na Experiência do Editor (VS Code)
Expandable Hovers (Preview): Ao passar o mouse (hover) sobre tipos, agora você pode expandir (+) ou colapsar (-) tipos complexos, como objetos aninhados, sem precisar pular para a definição.
Configuração de Tamanho do Hover: O servidor de linguagem 5.9 suporta um tamanho máximo de dica de ferramenta configurável via js/ts.hover.maximumLength, e o padrão é maior, exibindo mais informações.
Resumos na API DOM: As dicas de ferramentas do DOM agora incluem um breve resumo baseado na documentação MDN, útil para entender métodos como querySelector ou fetch. 
5. Melhorias de Desempenho
Cache de Instanciação de Tipos: O TS 5.9 otimiza a compilação de bibliotecas que usam genéricos complexos (como Zod, tRPC, React Query) ao cachear instâncias de tipos intermediários.
Verificação de Arquivos: Otimizações na verificação de existência de arquivos resultam em builds até 11% mais rápidos em projetos grandes. 
6. Mudanças de Comportamento e Breaking Changes 
ArrayBuffer no Node.js: ArrayBuffer não é mais um supertipo de certos TypedArrays (incluindo Buffer do Node.js). Isso pode gerar erros como TS2345 (Argument of type 'ArrayBufferLike' is not assignable to parameter of type 'BufferSource').
Correção: Atualize @types/node e, se necessário, use a propriedade .buffer em instâncias de TypedArray.
Inferência de Tipo: Melhorias para evitar "vazamentos" de variáveis de tipo podem causar novos erros de compilação em inferências complexas, corrigíveis adicionando argumentos de tipo genérico explicitamente. 
7. O Futuro (O que esperar)
O TypeScript 5.9 prepara terreno para o futuro da linguagem. Enquanto o time foca no port do compilador para Go (esperado para o TS v7), a v6 deve atuar como uma ponte, tornando a v5.9 uma atualização crucial para estabilidade e desempenho agora. 
Como instalar:
bash
npm install -D typescript@5.9
Announcing TypeScript 5.9 - Microsoft Developer Blog
1 de ago. de 2025 — Announcing TypeScript 5.9 * What's New Since the Beta and RC? * Minimal and Updated tsc --init. * Support for import defer. * Support for --module node20. * Sum...

Microsoft Dev Blogs

What’s New in TypeScript 5.9? A Developer’s Guide to the Latest ...
22 de ago. de 2025 — What's New in TypeScript 5.9? A Developer's Guide to the Latest Features. ... TypeScript has quickly become the backbone of modern JavaScript applications, givi...

Medium

Documentation - TypeScript 5.9
7 de ago. de 2025 — TypeScript 5.9 * Minimal and Updated tsc --init. For a while, the TypeScript compiler has supported an --init flag that can create a tsconfig. json within the c...

TypeScript

Yes, you should upgrade to TypeScript 5.9 — here's ...
29 de set. de 2025 — TypeScript 5.9 is here. The question on your mind after you read the announcement is likely: “Should we upgrade?” The short answer is a definitive yes. TypeScri...

LogRocket Blog

Microsoft Releases TypeScript 5.9 with ...
4 de ago. de 2025 — A lot of TypeScript felt esoteric and abstruse to me when I first learned it, so making the underlying information more immediately available is definitely a go...

infoq.com

TypeScript 5.9 Release Candidate
19 de ago. de 2025 — Unlocking TypeScript 5.9: Key Updates Every Developer Should Know. TypeScript continues to evolve, bringing smarter tools and better performance for developers.

Introduct Group

TypeScript 5.9 creates leaner tsconfig.json files | heise online
4 de ago. de 2025 — TypeScript 5.9 creates leaner tsconfig. json files * tsconfig.json gets rid of ballast. * Support for planned ECMAScript feature and expandable hovers. * The ne...

heise online

Why TypeScript 5.9 Is a Big Deal - Peerlist
6 de out. de 2025 — Why TypeScript 5.9 Is a Big Deal. TypeScript 5.9 isn't just a minor update—it's a meaningful leap forward. It introduces performance boosts, smarter defaults, a...

Peerlist
TypeScript 5.9 Brings Less Friction, More Features
9 de ago. de 2025 — Typescript 5.9 was released Aug. 1, with a slate of new features, including expandable hovers for preview, support for import defer and minimal and updated tsc ...

The New Stack

Announcing TypeScript 5.9 RC - Microsoft Developer Blog
26 de jul. de 2025 — Support for import defer. TypeScript 5.9 introduces support for ECMAScript's deferred module evaluation proposal using the new import defer syntax. This feature...

Microsoft Dev Blogs

Announcing TypeScript 5.9 - Microsoft Developer Blog
1 de ago. de 2025 — Announcing TypeScript 5.9 * What's New Since the Beta and RC? * Minimal and Updated tsc --init. * Support for import defer. * Support for --module node20. * Sum...










Microsoft Dev Blogs





                 We use optional cookies to improve your experience on our websites, such as through social media connections, and to display personalized advertising based on your online activity. If you reject optional cookies, only cookies necessary to provide you the services will be used. You may change your selection by clicking “Manage Cookies” at the bottom of the page. Privacy Statement Third-Party Cookies

Skip to main content
 Microsoft
Sign in
Dev Blogs
TypeScript
Announcing Type...
August 1st, 2025
celebratelikeheart10 reactions
Announcing TypeScript 5.9
Daniel Rosenwasser
Daniel Rosenwasser
Principal Product Manager
Today we are excited to announce the release of TypeScript 5.9!

If you’re not familiar with TypeScript, it’s a language that builds on JavaScript by adding syntax for types. With types, TypeScript makes it possible to check your code to avoid bugs ahead of time. The TypeScript type-checker does all this, and is also the foundation of great tooling in your editor and elsewhere, making coding even easier. If you’ve written JavaScript in editors like Visual Studio and VS Code, TypeScript even powers features you might already be using like completions, go-to-definition, and more. You can learn more about TypeScript at our website.

But if you’re already familiar, you can start using TypeScript 5.9 today!

npm install -D typescript
Let’s take a look at what’s new in TypeScript 5.9!

Minimal and Updated tsc --init
Support for import defer
Support for --module node20
Summary Descriptions in DOM APIs
Expandable Hovers (Preview)
Configurable Maximum Hover Length
Optimizations
Notable Behavioral Changes
What’s New Since the Beta and RC?
There have been no changes to TypeScript 5.9 since the release candidate.

A few fixes for reported issues have been made since the 5.9 beta, including the restoration of AbortSignal.abort() to the DOM library. Additionally, we have added a section about Notable Behavioral Changes.

Minimal and Updated tsc --init
For a while, the TypeScript compiler has supported an --init flag that can create a tsconfig.json within the current directory. In the last few years, running tsc --init created a very “full” tsconfig.json, filled with commented-out settings and their descriptions. We designed this with the intent of making options discoverable and easy to toggle.

However, given external feedback (and our own experience), we found it’s common to immediately delete most of the contents of these new tsconfig.json files. When users want to discover new options, we find they rely on auto-complete from their editor, or navigate to the tsconfig reference on our website (which the generated tsconfig.json links to!). What each setting does is also documented on that same page, and can be seen via editor hovers/tooltips/quick info. While surfacing some commented-out settings might be helpful, the generated tsconfig.json was often considered overkill.

We also felt that it was time that tsc --init initialized with a few more prescriptive settings than we already enable. We looked at some common pain points and papercuts users have when they create a new TypeScript project. For example, most users write in modules (not global scripts), and --moduleDetection can force TypeScript to treat every implementation file as a module. Developers also often want to use the latest ECMAScript features directly in their runtime, so --target can typically be set to esnext. JSX users often find that going back to set --jsx is needless friction, and its options are slightly confusing. And often, projects end up loading more declaration files from node_modules/@types than TypeScript actually needs; but specifying an empty types array can help limit this.

In TypeScript 5.9, a plain tsc --init with no other flags will generate the following tsconfig.json:

{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    // "rootDir": "./src",
    // "outDir": "./dist",

    // Environment Settings
    // See also https://aka.ms/tsconfig_modules
    "module": "nodenext",
    "target": "esnext",
    "types": [],
    // For nodejs:
    // "lib": ["esnext"],
    // "types": ["node"],
    // and npm install -D @types/node

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Style Options
    // "noImplicitReturns": true,
    // "noImplicitOverride": true,
    // "noUnusedLocals": true,
    // "noUnusedParameters": true,
    // "noFallthroughCasesInSwitch": true,
    // "noPropertyAccessFromIndexSignature": true,

    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
  }
}
For more details, see the implementing pull request and discussion issue.

Support for import defer
TypeScript 5.9 introduces support for ECMAScript’s deferred module evaluation proposal using the new import defer syntax. This feature allows you to import a module without immediately executing the module and its dependencies, providing better control over when work and side-effects occur.

The syntax only permits namespace imports:

import defer * as feature from "./some-feature.js";
The key benefit of import defer is that the module is only evaluated when one of its exports is first accessed. Consider this example:

// ./some-feature.ts
initializationWithSideEffects();

function initializationWithSideEffects() {
  // ...
  specialConstant = 42;

  console.log("Side effects have occurred!");
}

export let specialConstant: number;
When using import defer, the initializationWithSideEffects() function will not be called until you actually access a property of the imported namespace:

import defer * as feature from "./some-feature.js";

// No side effects have occurred yet

// ...

// As soon as `specialConstant` is accessed, the contents of the `feature`
// module are run and side effects have taken place.
console.log(feature.specialConstant); // 42
Because evaluation of the module is deferred until you access a member off of the module, you cannot use named imports or default imports with import defer:

// ❌ Not allowed
import defer { doSomething } from "some-module";

// ❌ Not allowed  
import defer defaultExport from "some-module";

// ✅ Only this syntax is supported
import defer * as feature from "some-module";
Note that when you write import defer, the module and its dependencies are fully loaded and ready for execution. That means that the module will need to exist, and will be loaded from the file system or a network resource. The key difference between a regular import and import defer is that the execution of statements and declarations is deferred until you access a property of the imported namespace.

This feature is particularly useful for conditionally loading modules with expensive or platform-specific initialization. It can also improve startup performance by deferring module evaluation for app features until they are actually needed.

Note that import defer is not transformed or “downleveled” at all by TypeScript. It is intended to be used in runtimes that support the feature natively, or by tools such as bundlers that can apply the appropriate transformation. That means that import defer will only work under the --module modes preserve and esnext.

We’d like to extend our thanks to Nicolò Ribaudo who championed the proposal in TC39 and also provided the implementation for this feature.

Support for --module node20
TypeScript provides several node* options for the --module and --moduleResolution settings. Most recently, --module nodenext has supported the ability to require() ECMAScript modules from CommonJS modules, and correctly rejects import assertions (in favor of the standards-bound import attributes).

TypeScript 5.9 brings a stable option for these settings called node20, intended to model the behavior of Node.js v20. This option is unlikely to have new behaviors in the future, unlike --module nodenext or --moduleResolution nodenext. Also unlike nodenext, specifying --module node20 will imply --target es2023 unless otherwise configured. --module nodenext, on the other hand, implies the floating --target esnext.

For more information, take a look at the implementation here.

Summary Descriptions in DOM APIs
Previously, many of the DOM APIs in TypeScript only linked to the MDN documentation for the API. These links were useful, but they didn’t provide a quick summary of what the API does. Thanks to a few changes from Adam Naji, TypeScript now includes summary descriptions for many DOM APIs based on the MDN documentation. You can see more of these changes here and here.

Expandable Hovers (Preview)
Quick Info (also called “editor tooltips” and “hovers”) can be very useful for peeking at variables to see their types, or at type aliases to see what they actually refer to. Still, it’s common for people to want to go deeper and get details from whatever’s displayed within the quick info tooltip. For example, if we hover our mouse over the parameter options in the following example:

export function drawButton(options: Options): void
We’re left with (parameter) options: Options.

Tooltip for a parameter declared as which just shows .

Do we really need to jump to the definition of the type Options just to see what members this value has?

Previously, that was actually the case. To help here, TypeScript 5.9 is now previewing a feature called expandable hovers, or “quick info verbosity”. If you use an editor like VS Code, you’ll now see a + and - button on the left of these hover tooltips. Clicking on the + button will expand out types more deeply, while clicking on the - button will collapse to the last view.

This feature is currently in preview, and we are seeking feedback for both TypeScript and our partners on Visual Studio Code. For more details, see the PR for this feature here.

Configurable Maximum Hover Length
Occasionally, quick info tooltips can become so long that TypeScript will truncate them to make them more readable. The downside here is that often the most important information will be omitted from the hover tooltip, which can be frustrating. To help with this, TypeScript 5.9’s language server supports a configurable hover length, which can be configured in VS Code via the js/ts.hover.maximumLength setting.

Additionally, the new default hover length is substantially larger than the previous default. This means that in TypeScript 5.9, you should see more information in your hover tooltips by default. For more details, see the PR for this feature here and the corresponding change to Visual Studio Code here.

Optimizations
Cache Instantiations on Mappers
When TypeScript replaces type parameters with specific type arguments, it can end up instantiating many of the same intermediate types over and over again. In complex libraries like Zod and tRPC, this could lead to both performance issues and errors reported around excessive type instantiation depth. Thanks to a change from Mateusz Burzyński, TypeScript 5.9 is able to cache many intermediate instantiations when work has already begun on a specific type instantiation. This in turn avoids lots of unnecessary work and allocations.

Avoiding Closure Creation in fileOrDirectoryExistsUsingSource
In JavaScript, a function expression will typically allocate a new function object, even if the wrapper function is just passing through arguments to another function with no captured variables. In code paths around file existence checks, Vincent Bailly found examples of these pass-through function calls, even though the underlying functions only took single arguments. Given the number of existence checks that could take place in larger projects, he cited a speed-up of around 11%. See more on this change here.

Notable Behavioral Changes
lib.d.ts Changes
Types generated for the DOM may have an impact on type-checking your codebase.

Additionally, one notable change is that ArrayBuffer has been changed in such a way that it is no longer a supertype of several different TypedArray types. This also includes subtypes of UInt8Array, such as Buffer from Node.js. As a result, you’ll see new error messages such as:

error TS2345: Argument of type 'ArrayBufferLike' is not assignable to parameter of type 'BufferSource'.
error TS2322: Type 'ArrayBufferLike' is not assignable to type 'ArrayBuffer'.
error TS2322: Type 'Buffer' is not assignable to type 'Uint8Array<ArrayBufferLike>'.
error TS2322: Type 'Buffer' is not assignable to type 'ArrayBuffer'.
error TS2345: Argument of type 'Buffer' is not assignable to parameter of type 'string | Uint8Array<ArrayBufferLike>'.
If you encounter issues with Buffer, you may first want to check that you are using the latest version of the @types/node package. This might include running

npm update @types/node --save-dev
Much of the time, the solution is to specify a more specific underlying buffer type instead of using the default ArrayBufferLike (i.e. explicitly writing out Uint8Array<ArrayBuffer> rather than a plain Uint8Array). In instances where some TypedArray (like Uint8Array) is passed to a function expecting an ArrayBuffer or SharedArrayBuffer, you can also try accessing the buffer property of that TypedArray like in the following example:

  let data = new Uint8Array([0, 1, 2, 3, 4]);
- someFunc(data)
+ someFunc(data.buffer)
Type Argument Inference Changes
In an effort to fix “leaks” of type variables during inference, TypeScript 5.9 may introduce changes in types and possibly new errors in some codebases. These are hard to predict, but can often be fixed by adding type arguments to generic functions calls. See more details here.

What’s Next?
Now that TypeScript 5.9 is out, you might be wondering what’s in store for the next version: TypeScript 6.0.

As you might have heard, much of our recent focus has been on the native port of TypeScript which will eventually be available as TypeScript 7.0. So what does that mean for TypeScript 6.0?

Our vision for TypeScript 6.0 is to act as a transition point for developers to adjust their codebases for TypeScript 7.0. While TypeScript 6.0 may still ship updates and features, most users should think of it as a readiness check for adopting TypeScript 7.0. This new version is meant to align with TypeScript 7.0, introducing deprecations around certain settings and possibly updating type-checking behavior in small ways. Luckily, we don’t predict most projects will have too much trouble upgrading to TypeScript 6.0, and it will likely be entirely API compatible with TypeScript 5.9.

We’ll have more details coming soon. That includes details on TypeScript 7.0 as well, where you can try it out in Visual Studio Code today and install it right in your project.

Otherwise, we hope that TypeScript 5.9 treats you well, and makes your day-to-day coding a joy.

Happy Hacking!

– Daniel Rosenwasser and the TypeScript Team

10
2
Category
TypeScript
Share
Author
Daniel Rosenwasser
Daniel Rosenwasser
Principal Product Manager
Daniel Rosenwasser is the product manager of the TypeScript team. He has a passion for programming languages, compilers, and great developer tooling.

2 comments
Discussion is closed. Login to edit/delete existing comments.

Sort by :
Newest

David Hanson August 2, 2025 · Edited
Nice work.

Do you have a proposed deprecation list for 6?


Akunyili Chukwuma August 1, 2025
Awesome, will TS 7.0 be released in 2026 or 2027?
The matching numbers would be epic.

Read next
July 25, 2025
Announcing TypeScript 5.9 RC
Daniel Rosenwasser
Daniel Rosenwasser
December 2, 2025
Progress on TypeScript 7 – December 2025
Daniel Rosenwasser
Daniel Rosenwasser
Stay informed
Get notified when new posts are published.
Email *
Country/Region *
I would like to receive the TypeScript Newsletter. Privacy Statement.
Follow this blog
Stackoverflow
What's new
Surface Pro
Surface Laptop
Surface Laptop Studio 2
Copilot for organizations
Copilot for personal use
AI in Windows
Explore Microsoft products
Windows 11 apps
Microsoft Store
Account profile
Download Center
Microsoft Store support
Returns
Order tracking
Certified Refurbished
Microsoft Store Promise
Flexible Payments
Education
Microsoft in education
Devices for education
Microsoft Teams for Education
Microsoft 365 Education
How to buy for your school
Educator training and development
Deals for students and parents
AI for education
Business
Microsoft Cloud
Microsoft Security
Dynamics 365
Microsoft 365
Microsoft Power Platform
Microsoft Teams
Microsoft 365 Copilot
Small Business
Developer & IT
Azure
Microsoft Developer
Microsoft Learn
Support for AI marketplace apps
Microsoft Tech Community
Microsoft Marketplace
Marketplace Rewards
Visual Studio
Company
Careers
About Microsoft
Company news
Privacy at Microsoft
Investors
Diversity and inclusion
Accessibility
Sustainability
Your Privacy Choices Consumer Health Privacy
Sitemap
Contact Microsoft
Privacy
Terms of use
Trademarks
Safety & eco
Recycling
About our ads
© Microsoft 2025





https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html



Skip to main content
TypeScript 5.9
TypeScript 5.8
TypeScript 5.7
TypeScript 5.6
TypeScript 5.5
TypeScript 5.4
TypeScript 5.3
TypeScript 5.2
TypeScript 5.1
TypeScript 5.0
TypeScript 4.9
TypeScript 4.8
TypeScript 4.7
TypeScript 4.6
TypeScript 4.5
TypeScript 4.4
TypeScript 4.3
TypeScript 4.2
TypeScript 4.1
TypeScript 4.0
TypeScript 3.9
TypeScript 3.8
TypeScript 3.7
TypeScript 3.6
TypeScript 3.5
TypeScript 3.4
TypeScript 3.3
TypeScript 3.2
TypeScript 3.1
TypeScript 3.0
TypeScript 2.9
TypeScript 2.8
TypeScript 2.7
TypeScript 2.6
TypeScript 2.5
TypeScript 2.4
TypeScript 2.3
TypeScript 2.2
TypeScript 2.1
TypeScript 2.0
TypeScript 1.8
TypeScript 1.7
TypeScript 1.6
TypeScript 1.5
TypeScript 1.4
TypeScript 1.3
TypeScript 1.1
TypeScript 5.9
Minimal and Updated tsc --init
For a while, the TypeScript compiler has supported an --init flag that can create a tsconfig.json within the current directory. In the last few years, running tsc --init created a very “full” tsconfig.json, filled with commented-out settings and their descriptions. We designed this with the intent of making options discoverable and easy to toggle.

However, given external feedback (and our own experience), we found it’s common to immediately delete most of the contents of these new tsconfig.json files. When users want to discover new options, we find they rely on auto-complete from their editor, or navigate to the tsconfig reference on our website (which the generated tsconfig.json links to!). What each setting does is also documented on that same page, and can be seen via editor hovers/tooltips/quick info. While surfacing some commented-out settings might be helpful, the generated tsconfig.json was often considered overkill.

We also felt that it was time that tsc --init initialized with a few more prescriptive settings than we already enable. We looked at some common pain points and papercuts users have when they create a new TypeScript project. For example, most users write in modules (not global scripts), and --moduleDetection can force TypeScript to treat every implementation file as a module. Developers also often want to use the latest ECMAScript features directly in their runtime, so --target can typically be set to esnext. JSX users often find that going back to set --jsx is needless friction, and its options are slightly confusing. And often, projects end up loading more declaration files from node_modules/@types than TypeScript actually needs; but specifying an empty types array can help limit this.

In TypeScript 5.9, a plain tsc --init with no other flags will generate the following tsconfig.json:

{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    // "rootDir": "./src",
    // "outDir": "./dist",
    // Environment Settings
    // See also https://aka.ms/tsconfig_modules
    "module": "nodenext",
    "target": "esnext",
    "types": [],
    // For nodejs:
    // "lib": ["esnext"],
    // "types": ["node"],
    // and npm install -D @types/node
    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    // Style Options
    // "noImplicitReturns": true,
    // "noImplicitOverride": true,
    // "noUnusedLocals": true,
    // "noUnusedParameters": true,
    // "noFallthroughCasesInSwitch": true,
    // "noPropertyAccessFromIndexSignature": true,
    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
  }
}
For more details, see the implementing pull request and discussion issue.

Support for import defer
TypeScript 5.9 introduces support for ECMAScript’s deferred module evaluation proposal using the new import defer syntax. This feature allows you to import a module without immediately executing the module and its dependencies, providing better control over when work and side-effects occur.

The syntax only permits namespace imports:

import defer * as feature from "./some-feature.js";
The key benefit of import defer is that the module is only evaluated when one of its exports is first accessed. Consider this example:

// ./some-feature.ts
initializationWithSideEffects();
function initializationWithSideEffects() {
  // ...
  specialConstant = 42;
  console.log("Side effects have occurred!");
}
export let specialConstant: number;
When using import defer, the initializationWithSideEffects() function will not be called until you actually access a property of the imported namespace:

import defer * as feature from "./some-feature.js";
// No side effects have occurred yet
// ...
// As soon as `specialConstant` is accessed, the contents of the `feature`
// module are run and side effects have taken place.
console.log(feature.specialConstant); // 42
Because evaluation of the module is deferred until you access a member off of the module, you cannot use named imports or default imports with import defer:

// ❌ Not allowed
import defer { doSomething } from "some-module";
// ❌ Not allowed  
import defer defaultExport from "some-module";
// ✅ Only this syntax is supported
import defer * as feature from "some-module";
Note that when you write import defer, the module and its dependencies are fully loaded and ready for execution. That means that the module will need to exist, and will be loaded from the file system or a network resource. The key difference between a regular import and import defer is that the execution of statements and declarations is deferred until you access a property of the imported namespace.

This feature is particularly useful for conditionally loading modules with expensive or platform-specific initialization. It can also improve startup performance by deferring module evaluation for app features until they are actually needed.

Note that import defer is not transformed or “downleveled” at all by TypeScript. It is intended to be used in runtimes that support the feature natively, or by tools such as bundlers that can apply the appropriate transformation. That means that import defer will only work under the --module modes preserve and esnext.

We’d like to extend our thanks to Nicolò Ribaudo who championed the proposal in TC39 and also provided the implementation for this feature.

Support for --module node20
TypeScript provides several node* options for the --module and --moduleResolution settings. Most recently, --module nodenext has supported the ability to require() ECMAScript modules from CommonJS modules, and correctly rejects import assertions (in favor of the standards-bound import attributes).

TypeScript 5.9 brings a stable option for these settings called node20, intended to model the behavior of Node.js v20. This option is unlikely to have new behaviors in the future, unlike --module nodenext or --moduleResolution nodenext. Also unlike nodenext, specifying --module node20 will imply --target es2023 unless otherwise configured. --module nodenext, on the other hand, implies the floating --target esnext.

For more information, take a look at the implementation here.

Summary Descriptions in DOM APIs
Previously, many of the DOM APIs in TypeScript only linked to the MDN documentation for the API. These links were useful, but they didn’t provide a quick summary of what the API does. Thanks to a few changes from Adam Naji, TypeScript now includes summary descriptions for many DOM APIs based on the MDN documentation. You can see more of these changes here and here.

Expandable Hovers (Preview)
Quick Info (also called “editor tooltips” and “hovers”) can be very useful for peeking at variables to see their types, or at type aliases to see what they actually refer to. Still, it’s common for people to want to go deeper and get details from whatever’s displayed within the quick info tooltip. For example, if we hover our mouse over the parameter options in the following example:

export function drawButton(options: Options): void
We’re left with (parameter) options: Options.

Tooltip for a parameter declared as options which just shows options: Options.

Do we really need to jump to the definition of the type Options just to see what members this value has?

Previously, that was actually the case. To help here, TypeScript 5.9 is now previewing a feature called expandable hovers, or “quick info verbosity”. If you use an editor like VS Code, you’ll now see a + and - button on the left of these hover tooltips. Clicking on the + button will expand out types more deeply, while clicking on the - button will collapse to the last view.

This feature is currently in preview, and we are seeking feedback for both TypeScript and our partners on Visual Studio Code. For more details, see the PR for this feature here.

Configurable Maximum Hover Length
Occasionally, quick info tooltips can become so long that TypeScript will truncate them to make them more readable. The downside here is that often the most important information will be omitted from the hover tooltip, which can be frustrating. To help with this, TypeScript 5.9’s language server supports a configurable hover length, which can be configured in VS Code via the js/ts.hover.maximumLength setting.

Additionally, the new default hover length is substantially larger than the previous default. This means that in TypeScript 5.9, you should see more information in your hover tooltips by default. For more details, see the PR for this feature here and the corresponding change to Visual Studio Code here.

Optimizations
Cache Instantiations on Mappers
When TypeScript replaces type parameters with specific type arguments, it can end up instantiating many of the same intermediate types over and over again. In complex libraries like Zod and tRPC, this could lead to both performance issues and errors reported around excessive type instantiation depth. Thanks to a change from Mateusz Burzyński, TypeScript 5.9 is able to cache many intermediate instantiations when work has already begun on a specific type instantiation. This in turn avoids lots of unnecessary work and allocations.

Avoiding Closure Creation in fileOrDirectoryExistsUsingSource
In JavaScript, a function expression will typically allocate a new function object, even if the wrapper function is just passing through arguments to another function with no captured variables. In code paths around file existence checks, Vincent Bailly found examples of these pass-through function calls, even though the underlying functions only took single arguments. Given the number of existence checks that could take place in larger projects, he cited a speed-up of around 11%. See more on this change here.

Notable Behavioral Changes
lib.d.ts Changes
Types generated for the DOM may have an impact on type-checking your codebase.

Additionally, one notable change is that ArrayBuffer has been changed in such a way that it is no longer a supertype of several different TypedArray types. This also includes subtypes of UInt8Array, such as Buffer from Node.js. As a result, you’ll see new error messages such as:

error TS2345: Argument of type 'ArrayBufferLike' is not assignable to parameter of type 'BufferSource'.
error TS2322: Type 'ArrayBufferLike' is not assignable to type 'ArrayBuffer'.
error TS2322: Type 'Buffer' is not assignable to type 'Uint8Array<ArrayBufferLike>'.
error TS2322: Type 'Buffer' is not assignable to type 'ArrayBuffer'.
error TS2345: Argument of type 'Buffer' is not assignable to parameter of type 'string | Uint8Array<ArrayBufferLike>'.
If you encounter issues with Buffer, you may first want to check that you are using the latest version of the @types/node package. This might include running

npm update @types/node --save-dev
Much of the time, the solution is to specify a more specific underlying buffer type instead of using the default ArrayBufferLike (i.e. explicitly writing out Uint8Array<ArrayBuffer> rather than a plain Uint8Array). In instances where some TypedArray (like Uint8Array) is passed to a function expecting an ArrayBuffer or SharedArrayBuffer, you can also try accessing the buffer property of that TypedArray like in the following example:

  let data = new Uint8Array([0, 1, 2, 3, 4]);
- someFunc(data)
+ someFunc(data.buffer)
Type Argument Inference Changes
In an effort to fix “leaks” of type variables during inference, TypeScript 5.9 may introduce changes in types and possibly new errors in some codebases. These are hard to predict, but can often be fixed by adding type arguments to generic functions calls. See more details here.

On this page
Minimal and Updated tsc --init
Support for import defer
Support for --module node20
Summary Descriptions in DOM APIs
Expandable Hovers (Preview)
Configurable Maximum Hover Length
Optimizations
Cache Instantiations on Mappers
Avoiding Closure Creation in fileOrDirectoryExistsUsingSource
Notable Behavioral Changes
lib.d.ts Changes
Type Argument Inference Changes
Is this page helpful?
The TypeScript docs are an open source project. Help us improve these pages by sending a Pull Request ❤

Contributors to this page:
JBJake Bailey  (6)
Last updated: Feb 04, 2026

This page loaded in 0.44 seconds.

Customize
Site Colours:

Code Font:

Popular Documentation Pages
Everyday Types
All of the common types in TypeScript

Creating Types from Types
Techniques to make more elegant types

More on Functions
How to provide types to functions in JavaScript

More on Objects
How to provide a type shape to JavaScript objects

Narrowing
How TypeScript infers types based on runtime behavior

Variable Declarations
How to create and type JavaScript variables

TypeScript in 5 minutes
An overview of building a TypeScript web app

TSConfig Options
All the configuration options for a project

Classes
How to provide types to JavaScript ES6 classes

Made with ♥ in Redmond, Boston, SF & Dublin

Microsoft Logo
© 2012-2026 Microsoft
PrivacyTerms of Use

Using TypeScript
Get Started
Download
Community
Playground
TSConfig Ref
Code Samples
Why TypeScript
Design
Community
Get Help
Blog
GitHub Repo
Community Chat
@TypeScript
Mastodon
Stack Overflow
Web Repo




























