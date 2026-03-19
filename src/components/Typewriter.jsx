import { useEffect, useState } from 'react';

const ROLES = [
  'Full-Stack Developer',
  'React Engineer',
  'Backend Builder',
  'Problem Solver'
];

export const Typewriter = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(80);

  useEffect(() => {
    const currentRole = ROLES[currentRoleIndex];
    
    let timer;
    
    if (!isDeleting) {
      // Typing
      if (displayedText.length < currentRole.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentRole.slice(0, displayedText.length + 1));
          setSpeed(80);
        }, speed);
      } else {
        // Pause before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    } else {
      // Deleting
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
          setSpeed(40);
        }, speed);
      } else {
        // Move to next role
        setIsDeleting(false);
        setCurrentRoleIndex((prev) => (prev + 1) % ROLES.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentRoleIndex, speed]);

  return (
    <span className="text-accent font-body">
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
};
