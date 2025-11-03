'use client'

import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Button, TextField } from '@mui/material'

export default function ReportForm() {
  const [wasteType, setWasteType] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [coords, setCoords] = React.useState<{ lat: number; lon: number } | null>(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        (err) => console.error('Ошибка при получении геолокации:', err),
      )
    } else {
      alert('Геолокация не поддерживается вашим браузером')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!coords) {
      alert('Не удалось определить ваше местоположение')
      return
    }
    if (!wasteType || !description) {
      alert('Заполните все поля!')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wasteType,
          description,
          latitude: coords.lat,
          longitude: coords.lon,
        }),
      })

      const data = await res.json()
      if (data.success) {
        alert('Отчёт успешно отправлен!')
        setWasteType('')
        setDescription('')
      } else {
        alert('Ошибка при сохранении данных')
      }
    } catch (err) {
      console.error(err)
      alert('Ошибка при отправке запроса')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-20 flex flex-col items-center w-full">
      <section className="w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-6">

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white shadow p-4 sm:p-6 rounded-xl border"
        >
          <input
            type="file"
            className="border rounded p-2 text-sm sm:text-base"
            accept="image/*"
          />

          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="waste-type-label">Тип мусора</InputLabel>
            <Select
              labelId="waste-type-label"
              id="waste-type-select"
              value={wasteType}
              label="Тип мусора"
              onChange={(e: SelectChangeEvent) => setWasteType(e.target.value)}
            >
              <MenuItem value={'Пластик и упаковка'}>♻️ Пластик и упаковка</MenuItem>
              <MenuItem value={'Строительный мусор'}>
                🗑️ Строительный и крупногабаритный мусор
              </MenuItem>
              <MenuItem value={'Химические загрязнения'}>
                🛢️ Химические и нефтяные загрязнения
              </MenuItem>
              <MenuItem value={'Органические отходы'}>
                🍃 Органические отходы и бытовой мусор
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            id="outlined-basic"
            label="Краткое описание"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Отправка...' : 'Отправить'}
          </Button>
        </form>

        {coords && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            📍 Ваши координаты: {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}
          </p>
        )}
      </section>
    </div>
  )
}
