const IconWrapper = ({ children, strokeColor }) => (
    <svg
      className="w-[2vw] h-[2vw]"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children(strokeColor)}
    </svg>
  );
  
  const HomeIcon = ({ strokeColor }) => (
    <IconWrapper strokeColor={strokeColor}>
      {(color) => (
        <>
          <path
            d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 22V12H15V22"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </IconWrapper>
  );
  
  const LayoutIcon = ({ strokeColor }) => (
    <IconWrapper strokeColor={strokeColor}>
      {(color) => (
        <>
          <path
            d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M7.28516 7.28564H16.7137" stroke={color} strokeWidth="2" />
          <path d="M7.28516 12H16.7137" stroke={color} strokeWidth="2" />
          <path d="M7.28516 16.2856H16.7137" stroke={color} strokeWidth="2" />
        </>
      )}
    </IconWrapper>
  );
  
  const ShoppingIcon = ({ strokeColor }) => (
    <IconWrapper strokeColor={strokeColor}>
      {(color) => (
        <>
          <path
            d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M3 6H21" stroke={color} strokeWidth="2" />
          <path
            d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </IconWrapper>
  );
  
  const UserIcon = ({ strokeColor }) => (
    <IconWrapper strokeColor={strokeColor}>
      {(color) => (
        <>
          <path
            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </IconWrapper>
  );

  const TrendingIcon = ({ strokeColor }) => (
    <IconWrapper strokeColor={strokeColor}>
      {(color) => (
        <>
          <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 6H23V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      )}
    </IconWrapper>
  );

  const SearchIcon = ({ strokeColor }) => (
    <IconWrapper strokeColor={strokeColor}>
      {(color) => (
        <>
         <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M20.9984 21L16.6484 16.65" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

        </>
      )}
    </IconWrapper>
  );

  const BookIcon = ({ strokeColor }) => (
    <IconWrapper strokeColor={strokeColor}>
      {(color) => (
        <>
          <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2V2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

        </>
      )}
    </IconWrapper>
  );
  
  const GiftIcon = ({ strokeColor }) => (
    <IconWrapper strokeColor={strokeColor}>
      {(color) => (
        <>
          <path d="M20 12V22H4V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M22 7.00003H2V12H22V7.00003Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12 22V7.00003" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12 6.99997H7.5C6.83696 6.99997 6.20107 6.73658 5.73223 6.26774C5.26339 5.7989 5 5.16301 5 4.49997C5 3.83693 5.26339 3.20104 5.73223 2.7322C6.20107 2.26336 6.83696 1.99997 7.5 1.99997C11 1.99997 12 6.99997 12 6.99997Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12 6.99997H16.5C17.163 6.99997 17.7989 6.73658 18.2678 6.26774C18.7366 5.7989 19 5.16301 19 4.49997C19 3.83693 18.7366 3.20104 18.2678 2.7322C17.7989 2.26336 17.163 1.99997 16.5 1.99997C13 1.99997 12 6.99997 12 6.99997Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
       </>
      )}
    </IconWrapper>
  );

export { HomeIcon, UserIcon, LayoutIcon, ShoppingIcon, TrendingIcon, SearchIcon, BookIcon, GiftIcon};