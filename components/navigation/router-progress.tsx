import { useRef, useEffect } from 'react';
import NProgress from 'nprogress';
import { Router } from 'next/router';

interface RouterProgressProps {}

const RouterProgress: React.FC<RouterProgressProps> = () => {
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const onChangeStart = () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(NProgress.start, 500);
    };

    const onChangeEnd = () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      NProgress.done();
    };

    Router.events.on('routeChangeStart', onChangeStart);
    Router.events.on('routeChangeComplete', onChangeEnd);
    Router.events.on('routeChangeError', onChangeEnd);

    NProgress.configure({
      minimum: 0.15,
      trickleSpeed: 120
    });

    return () => {
      Router.events.off('routeChangeStart', onChangeStart);
      Router.events.off('routeChangeComplete', onChangeEnd);
      Router.events.off('routeChangeError', onChangeEnd);
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  });

  return (
    <style jsx global>{`
      #nprogress {
        pointer-events: none;
      }
      #nprogress .bar {
        background: #fff;
        position: fixed;
        z-index: 15000;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
      }
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.75), 0 0 5px rgba(255, 255, 255, 0.75);
        opacity: 1;
        -webkit-transform: rotate(3deg) translate(0px, -4px);
        -ms-transform: rotate(3deg) translate(0px, -4px);
        transform: rotate(3deg) translate(0px, -4px);
      }
      #nprogress .spinner {
        display: none;
      }
      .nprogress-custom-parent {
        overflow: hidden;
        position: relative;
      }
      .nprogress-custom-parent #nprogress .bar {
        position: absolute;
      }
    `}</style>
  );
};

export default RouterProgress;
