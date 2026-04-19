# Documentação Técnica: DECIMALCHRONO v2.0

Esta documentação detalha a arquitetura, o fluxo de dados e os princípios de design do sistema **DECIMALCHRONO**.

---

## 1. Arquitetura Geral

O projeto é construído em **React 19** utilizando **Vite** como build tool. A arquitetura segue o padrão de separação de interesses (*Separation of Concerns*), dividindo a lógica em Hooks Customizados, a UI em Componentes Modulares e as utilidades em bibliotecas puras de TypeScript.

### Estrutura de Pastas:
- `/src/components`: Componentes UI Reutilizáveis e Módulos de Interface.
- `/src/hooks`: Lógica de gerenciamento de estado e integração com APIs do Navegador.
- `/src/lib`: Bibliotecas de conversão matemática e lógica temporal decimal.
- `/src/services`: (Opcional) Integrações com APIs externas (NASA, Weather).

---

## 2. O Motor Temporal (Temporal Engine)

O arquivo central de lógica é o `src/lib/decimalLogic.ts`. Ele é responsável por converter o sistema sexagesimal padrão (base 60) para o sistema decimal (base 10).

- **Tempo Decimal:** Calcula o total de milissegundos do dia e divide por $864$ (a duração de 1 segundo decimal).
- **Calendário Decimal:** Implementa meses de 36 a 38 dias para fechar um ano de 365/366 dias em 10 meses.
- **Astronomia:** Contém funções que calculam o declínio solar e horários de nascer/pôr do sol com base em coordenadas lat/lng.

---

## 3. Gerenciamento de Estado (Core Logic)

A aplicação utiliza o hook horizontal `useAppLogic.ts` para centralizar o estado global sem a necessidade de Context providers complexos ou Redux.

### Principais Estados:
- `appMode`: Controla qual módulo está ativo (Clock, Zen, Astro, etc.).
- `themeColor`: Cor primária do HUD (Amber, Cobalt, etc.).
- `displayMode`: Alterna entre interfaces 'Standard' e 'Decimal'.
- `telemetry`: Dados vindos diretamente de hooks de sensores (GPS, Acelerômetro).

---

## 4. O Sistema de Módulos (Modularization)

A renderização do HUD é feita pelo `ModuleRenderer.tsx`. Esse componente atua como um "Dispatcher", recebendo todo o estado do sistema e decidindo qual submódulo exibir.

- **ModuleLayout:** Um componente de "casco" que provê o título, subtítulo e as molduras táticas.
- **Submódulos (ex: `ZenModule.tsx`):** Componentes puros que recebem apenas os dados necessários para sua função específica.

---

## 5. Sensores e Integração de Hardware

Para garantir a experiência "Tactical", utilizamos as APIs modernas do ecossistema Web:

- **GPS/Compass:** `navigator.geolocation` e `deviceorientation`.
- **Áudio:** `Web Audio API` para gerar bips táticos e gerenciar as frequências de relaxamento no modo Zen.
- **Magnetômetro:** Utilizado no módulo EMF para detectar campos magnéticos (com fallback de simulação em navegadores restritos).
- **Bluetooth:** Integrado via `navigator.bluetooth` no submódulo Radar para scan de periféricos.

---

## 6. Estilização e Temas (Tactical UI)

A interface utiliza **Tailwind CSS v4** com um sistema de variáveis CSS dinâmicas.

- **Variação de Cor:** As cores são passadas via props do componente pai, permitindo a mudança instantânea de "Amber" (estilo Fallout) para "Emerald" (estilo Radar Digital) em todos os componentes simultaneamente.
- **Animações:** Utilizamos a biblioteca `motion` (Framer Motion) para simular o comportamento de hardware real (flickers, scans e transições de entrada).

---

## 7. Fluxo de Dados NASA NEO

O `AstroModule.tsx` consome dados da NASA via `fetch`.
1. O sistema verifica o dia atual (J2000 epoch).
2. Faz o request para a API de Near-Earth Objects.
3. Filtra objetos "Potencialmente Perigosos" (PHA).
4. Renderiza no canvas 2D a trajetória orbital dos planetas próximos.

---

## 8. Considerações de Segurança e Permissões

A aplicação requer permissões explícitas para:
1. **Localização:** Para cálculo de nascer do sol e radar.
2. **Microfone:** Para análise de níveis de ruído no módulo de sono/áudio.
3. **Sensores de Movimento:** Para o podômetro e seismo-scanner.

Em conexões não-seguras (HTTP), o sistema ativa automaticamente os **Fallbacks de Simulação** para manter a integridade visual da interface.

---

*Wiencci Systems // Documentação v2.0 // Abril 2026*
