import { useEffect, useState } from 'react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import {
  Group,
  useMantineTheme,
  Text,
  Image,
  Title,
  Loader,
  Paper,
  Center,
} from '@mantine/core';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons';

function App() {
  const theme = useMantineTheme();
  const reader = new FileReader();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [result, setResult] = useState<string>();

  useEffect(() => {
    if (isError) setIsLoading(false);
  }, [isError]);

  return (
    <Paper
      w={'100%'}
      h={'100%'}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Title>
        {isError
          ? 'An unknown error occurred. (Most likely rate limited or imge too big) Try again'
          : 'Drag and drop image to upload'}
      </Title>
      {(result || isLoading) && (
        <Image
          mt='md'
          src={result ?? undefined}
          style={{ maxWidth: '350px' }}
          mx='auto'
          height={550}
          withPlaceholder
          placeholder={<Loader />}
        />
      )}
      {!isLoading && (
        <Dropzone
          loading={isLoading}
          mt='md'
          onDrop={(files) => {
            reader.readAsDataURL(files[0]);
            setIsLoading(true);
            setResult(undefined);

            reader.onload = () => {
              fetch('/api/processanime', {
                headers: {
                  'Content-type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                  image: reader.result!.toString().split(',')[1],
                }),
              })
                .then((res) => res.json())
                .then((json) => {
                  setIsLoading(false);

                  if (Array.isArray(json.img_urls)) {
                    setResult(json.img_urls[0]);
                  } else {
                    setIsError(true);
                  }
                })
                .catch(() => setIsError(true));
            };
          }}
          onReject={(files) => setIsLoading(false)}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
        >
          <Group
            position='center'
            spacing='xl'
            style={{ minHeight: 220, pointerEvents: 'none' }}
          >
            <Dropzone.Accept>
              <IconUpload
                size={50}
                stroke={1.5}
                color={
                  theme.colors[theme.primaryColor][
                    theme.colorScheme === 'dark' ? 4 : 6
                  ]
                }
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size={50}
                stroke={1.5}
                color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={50} stroke={1.5} />
            </Dropzone.Idle>

            <div>
              <Text size='xl' inline>
                Drag image here or click to select files
              </Text>
            </div>
          </Group>
        </Dropzone>
      )}
    </Paper>
  );
}

export default App;
