import useCountUp from '../../hooks/useCountUp.js';

/**
 * Animated number that counts up when scrolled into view.
 */
export default function CountUp({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1400,
  start = 0,
  className = '',
}) {
  const { ref, value: current } = useCountUp(value, { duration, start });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {current.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
