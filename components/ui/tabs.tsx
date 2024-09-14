import * as React from 'react';
import { Box, Button, Card, alpha } from '@mui/material';
import * as TabsPrimitive from '@radix-ui/react-tabs';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ children, ...props }, ref) => (
  <Card variant="outlined" sx={{ p: 1 }}>
    <TabsPrimitive.List ref={ref} asChild {...props}>
      <Box
        sx={{
          display: 'flex',
          columnGap: {
            md: '0.5rem'
          },
          rowGap: '0.25rem',
          justifyContent: {
            xs: 'space-between',
            md: 'space-around'
          },
          flexWrap: 'wrap',
          '& > *': {
            flexBasis: {
              xs: '49%',
              md: 'auto'
            }
          }
        }}
      >
        {children}
      </Box>
    </TabsPrimitive.List>
  </Card>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    icon?: React.ReactNode;
    badgeCount?: number;
  }
>(({ children, icon, badgeCount = 0, ...props }, ref) => (
  <TabsPrimitive.Trigger ref={ref} {...props} asChild>
    <Button
      disableRipple
      startIcon={icon}
      sx={{
        fontSize: '0.875rem',
        fontWeight: 500,
        px: 2,
        py: 0.75,
        color: 'text.secondary',
        textTransform: 'none',
        ':hover': {
          bgcolor: theme => alpha(theme.palette.text.secondary, 0.04)
        },
        '&[data-state="active"]': {
          color: 'secondary.main',
          bgcolor: theme => alpha(theme.palette.secondary.main, 0.1)
        }
      }}
    >
      {children}

      {badgeCount > 0 && (
        <Box
          sx={{
            ml: 0.5,
            border: '1px solid',
            borderColor: 'divider',
            color: 'text.secondary',
            bgcolor: 'common.white',
            padding: '0.25em 0.5em',
            fontSize: '0.75em',
            fontWeight: '700',
            lineHeight: '1',
            borderRadius: '10rem'
          }}
          component="span"
        >
          {badgeCount}
        </Box>
      )}
    </Button>
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>((props, ref) => <TabsPrimitive.Content ref={ref} {...props} />);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
