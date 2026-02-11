interface ScrollSpyProviderProps {
  readonly children: React.ReactNode
  /**
   * IDs das seções rastreadas pelo ScrollSpy.
   * Mantido para alinhamento com PageWrapper e navegação semântica.
   */
  readonly sectionIds?: readonly string[]
} 
export function ScrollSpyProvider({
  children,
  sectionIds,
}: ScrollSpyProviderProps): JSX.Element {
  const [activeSection, setActiveSectionState] =
    useState<ActiveSection>(null)

  const setActiveSection = useCallback(
    (section: ActiveSection) => {
      setActiveSectionState((prev) =>
        prev === section ? prev : section,
      )
    },
    [],
  )

  const resetActiveSection = useCallback(() => {
    setActiveSectionState(null)
  }, [])

  const value = useMemo<ScrollSpyContextValue>(
    () => ({
      activeSection,
      setActiveSection,
      resetActiveSection,
    }),
    [activeSection, setActiveSection, resetActiveSection],
  )

  return (
    <ScrollSpyContext.Provider value={value}>
      {children}
    </ScrollSpyContext.Provider>
  )
}
