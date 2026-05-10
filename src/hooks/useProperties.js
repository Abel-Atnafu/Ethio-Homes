import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const PAGE_SIZE = 12

export function useProperties({
  city,
  priceType,
  propertyType,
  bedrooms,
  minPrice,
  maxPrice,
  featured,
  agentId,
  page = 1,
  limit = PAGE_SIZE,
  similarTo,
} = {}) {
  const [properties, setProperties] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      setLoading(true)
      setError(null)

      try {
        let query = supabase
          .from('properties')
          .select('*', { count: 'exact' })
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (featured) query = query.eq('is_featured', true)
        if (city && city !== 'all') query = query.eq('city', city)
        if (priceType) query = query.eq('price_type', priceType)
        if (propertyType && propertyType !== 'all') query = query.eq('property_type', propertyType)
        if (bedrooms && bedrooms !== 'any') {
          if (bedrooms === '4+') {
            query = query.gte('bedrooms', 4)
          } else {
            query = query.eq('bedrooms', parseInt(bedrooms))
          }
        }
        if (minPrice) query = query.gte('price', parseFloat(minPrice))
        if (maxPrice) query = query.lte('price', parseFloat(maxPrice))
        if (agentId) query = query.eq('agent_id', agentId)

        // For similar properties: same city and property_type, exclude current
        if (similarTo) {
          query = query
            .eq('city', similarTo.city)
            .eq('property_type', similarTo.property_type)
            .neq('id', similarTo.id)
          query = query.limit(3)
        } else {
          const from = (page - 1) * limit
          const to = from + limit - 1
          query = query.range(from, to)
        }

        const { data, error: err, count: total } = await query

        if (cancelled) return

        if (err) {
          setError(err.message)
        } else {
          setProperties(data || [])
          setCount(total || 0)
        }
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [city, priceType, propertyType, bedrooms, minPrice, maxPrice, featured, agentId, page, limit, similarTo?.id])

  return { properties, count, loading, error }
}
