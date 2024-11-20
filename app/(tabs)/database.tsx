import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SQLiteDatabase, SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { Suspense, useEffect, useState } from 'react';
import ThemedButton from '@/components/ThemedButton';
import uuid from 'react-native-uuid';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { ThemedIcon } from '@/components/ThemedIcon';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedTextInput } from '@/components/ThemedTextInput';

export default function DatabaseScreen() {

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<Ionicons size={310} name="document" style={styles.headerImage} />}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Database Service</ThemedText>
            </ThemedView>
            <ThemedText>This tab should show your SQLite database.</ThemedText>
            <Suspense fallback={<ActivityIndicator />}>
                <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded} useSuspense>
                    <Header />
                    <Content />
                </SQLiteProvider>
            </Suspense>
        </ParallaxScrollView>
    );
}


export function Header() {
    const db = useSQLiteContext();
    const [version, setVersion] = useState('');
    useEffect(() => {
        async function setup() {
            const result = await db.getFirstAsync<{ 'sqlite_version()': string }>(
                'SELECT sqlite_version()'
            );
            setVersion(result ? result['sqlite_version()'] : '');
        }
        setup();
    }, []);
    return (
        <ThemedView>
            <ThemedText>SQLite version: {version}</ThemedText>
        </ThemedView>
    );
}


interface Todo {
    id: number;
    value: string;
    uuid: string;
}

export function Content() {
    const db = useSQLiteContext();
    const [todoInput, setTodoInput] = useState("");
    const [todos, setTodos] = useState<Todo[]>([]);

    async function setup() {
        const result = await db.getAllAsync<Todo>('SELECT * FROM todos');
        setTodos(result);
    }

    useEffect(() => {
        setup();
    }, []);

    async function addItem(db: SQLiteDatabase, input: string) {
        if (!input) {
            return;
        }
        setTodoInput('');
        await db.runAsync('INSERT INTO todos (value, uuid) VALUES (?, ?)', input, uuid.v4() as string);
        await setup();
    };

    async function removeItem(db: SQLiteDatabase, id: number) {
        await db.runAsync('DELETE FROM todos WHERE id = ?', id);
        await setup();
    };

    return (
        <ThemedView style={styles.column}>
            {todos.map((todo, index) => (
                <ThemedView key={index} style={styles.row}>
                    <ThemedText>{`${todo.id} - ${todo.value}`}</ThemedText>
                    <ThemedIcon onPress={() => removeItem(db, todo.id)} size={30} name="trash-outline"></ThemedIcon>
                </ThemedView>
            ))}
            <ThemedTextInput
                onSubmitEditing={() => addItem(db, todoInput)}
                placeholder="Enter ToDo..."
                onChangeText={todoInput => setTodoInput(todoInput)}
                value={todoInput}
            />
            <ThemedButton onPress={() => addItem(db, todoInput)} label={'Add ToDo'} disabled={!todoInput}>
                <ThemedText>This tab should show your location.</ThemedText>
            </ThemedButton>
        </ThemedView>
    );
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1;
    let currentVersionInfo = await db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version'
    );
    let currentVersion = currentVersionInfo?.user_version ?? 0;
    console.log(currentVersion);
    if (currentVersion >= DATABASE_VERSION) {
        return;
    }
    if (currentVersion === 0) {
        console.log('Starting migration...')
        await db.execAsync(`
  PRAGMA journal_mode = 'wal';
  CREATE TABLE todos (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, uuid VARCHAR(36));
  `);
        await db.runAsync('INSERT INTO todos (value, uuid) VALUES (?, ?)', 'hello', uuid.v4() as string);
        await db.runAsync('INSERT INTO todos (value, uuid) VALUES (?, ?)', 'world', uuid.v4() as string);
        currentVersion = 1;
    }
    // if (currentVersion === 1) {
    // }
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    column: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        gap: 24,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
    },
});
