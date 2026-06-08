# Avión de Papel

Juego arcade: avión que sigue el cursor, obstáculos que disparan misiles, escudos, vidas (1–3) con multiplicador de puntos, feedback visual intenso y música Phonk aleatoria. Todo en `localStorage`.

## Mecánicas

- **Disparos:** mantén clic hacia el cursor; destruye obstáculos (+2.500 pts c/u).
- **Monedero:** puntos guardados en `localStorage` (`avion-papel-wallet`) para tienda futura.
- **Revivir:** 22.000 pts del monedero al terminar la partida.
- **Personalización:** fondo (cuadrícula / ciudad / espacio) y colores de nave con color picker.
- **Puntos:** +1.000 × multiplicador por segundo (×1 / ×2 / ×3 según vidas).
- **Power-ups** (icono + color único, puntos al recoger):
  - Escudo verde (+3.500) · Invuln dorado (+7.500) · Frenesí morado (+5.000, cámara lenta enemigos)
  - Bomba naranja (+10.000 + bonus por obstáculo) · Multidisparo cyan (+6.000, hasta 3 proyectiles)
  - Gigante rosa (−8.000, hitbox grande) · Mini índigo (−4.000, hitbox pequeña)
- **Música:** Phonk aleatorio al iniciar.

## Colores

Primario rojo · secundario negro · detalle verde.

## Desarrollo

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)

## Música local (opcional)

Ver `public/audio/README.md` para añadir MP3 propios desde Pixabay o Mixkit.

## Almacenamiento

Clave `avion-papel-stats`: récord, partidas, puntos totales, mejor tiempo.
