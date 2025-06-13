import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Embedding, LSTM, Dropout, Bidirectional
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pickle
import re
import os

class EmotionDetectionModel:
    def __init__(self):
        self.tokenizer = None
        self.model = None
        self.label_encoder = None
        self.max_length = 150
        self.vocab_size = 15000
        
        # Indonesian preprocessing - dengan fallback yang lebih baik
        self.stemmer_id = None
        self.stopword_remover_id = None
        
        try:
            from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
            from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
            self.stemmer_id = StemmerFactory().create_stemmer()
            self.stopword_remover_id = StopWordRemoverFactory().create_stop_word_remover()
            print("✅ Sastrawi loaded successfully")
        except ImportError:
            print("⚠️  Warning: Sastrawi not available. Install with: pip install Sastrawi")
        except Exception as e:
            print(f"⚠️  Warning: Could not initialize Sastrawi: {e}")

    def standardize_emotion_labels(self, labels):
        """Standardize berbagai format label emosi"""
        emotion_mapping = {
            'kesedihan': 0,
            'kegembiraan': 1, 
            'kemarahan': 2,
            'ketakutan': 3,
            'cinta': 4,
            'kejutan': 5,
            'sadness': 0,
            'joy': 1,
            'anger': 2,
            'fear': 3,
            'love': 4,
            'surprise': 5,
            '0': 0,
            '1': 1, 
            '2': 2,
            '3': 3,
            '4': 4,
            '5': 5
        }
        
        standardized = []
        for label in labels:
            label_str = str(label).lower().strip()
            standardized_label = emotion_mapping.get(label_str, label_str)
            standardized.append(standardized_label)
        
        return standardized

    def detect_delimiter(self, csv_path):
        """Deteksi delimiter CSV secara otomatis"""
        delimiters = [';', ',', '\t', '|']  # Prioritaskan semicolon untuk dataset Indonesia
        
        try:
            with open(csv_path, 'r', encoding='utf-8') as f:
                first_line = f.readline().strip()
                print(f"📋 First line sample: {first_line[:100]}...")
                
            delimiter_counts = {}
            for delim in delimiters:
                delimiter_counts[delim] = first_line.count(delim)
            
            print(f"📊 Delimiter counts: {delimiter_counts}")
            
            best_delimiter = max(delimiter_counts, key=delimiter_counts.get)
            
            if delimiter_counts[best_delimiter] > 0:
                print(f"📊 Detected delimiter: '{best_delimiter}' (count: {delimiter_counts[best_delimiter]})")
                return best_delimiter
            else:
                print("📊 No clear delimiter found, using comma as default")
                return ','
                
        except Exception as e:
            print(f"⚠️  Could not detect delimiter: {e}. Using comma as default")
            return ','

    def load_emotion_dataset(self, csv_path, text_column=None, emotion_column=None, has_header=True):
        """Load dataset emosi dengan deteksi delimiter otomatis"""
        print(f"\n📁 Loading emotion dataset: {csv_path}")
        
        # Deteksi delimiter
        delimiter = self.detect_delimiter(csv_path)
        
        # Coba berbagai encoding
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        df = None
        
        for encoding in encodings:
            try:
                # Coba memuat dengan pandas
                if has_header:
                    df = pd.read_csv(csv_path, encoding=encoding, on_bad_lines='skip', delimiter=delimiter)
                    print(f"✅ Successfully loaded with encoding: {encoding} (with header)")
                else:
                    df = pd.read_csv(csv_path, encoding=encoding, on_bad_lines='skip', header=None, delimiter=delimiter)
                    print(f"✅ Successfully loaded with encoding: {encoding} (without header)")
                    
                    # Cek apakah kolom sudah terpisah dengan benar
                    if df.shape[1] == 2:
                        df.columns = ['text', 'emotion']  # Berikan nama kolom default
                    else:
                        print(f"❌ Error: Expected 2 columns but got {df.shape[1]} columns.")
                        continue  # Coba encoding berikutnya
                break
                
            except UnicodeDecodeError:
                print(f"❌ Failed with encoding: {encoding}")
                continue
            except Exception as e:
                print(f"❌ Error with encoding {encoding}: {e}")
                continue
    
        if df is None:
            raise ValueError("Could not load the dataset with any encoding")
    
        print(f"📊 Dataset shape: {df.shape}")
        print(f"📊 Columns: {df.columns.tolist()}")
    
        # Tampilkan beberapa baris pertama untuk debugging
        print(f"📋 First few rows:")
        print(df.head(3))
    
        # Auto-detect columns untuk dataset dengan header
        if has_header:
            if text_column is None:
                text_column = 'text'  # Menggunakan nama kolom default
            if emotion_column is None:
                emotion_column = 'emotion'  # Menggunakan nama kolom default
    
        print(f"📝 Using text column: '{text_column}', emotion column: '{emotion_column}'")
    
        # Check if columns exist
        if text_column not in df.columns or emotion_column not in df.columns:
            print(f"❌ Available columns: {df.columns.tolist()}")
            raise ValueError(f"Columns '{text_column}' or '{emotion_column}' not found in dataset")
    
        # Extract and clean data
        texts = df[text_column].astype(str).tolist()
        emotions = df[emotion_column].astype(str).tolist()
        
        # Standardize emotions
        standardized_emotions = self.standardize_emotion_labels(emotions)
        
        # Filter valid data
        filtered_texts = []
        filtered_emotions = []
        
        for text, emotion in zip(texts, standardized_emotions):
            if (len(str(text).strip()) > 3 and 
                str(emotion).lower() not in ['nan', 'none', '', 'null']):
                
                processed_text = self.preprocess_text(text)
                if len(processed_text.strip()) > 1:
                    filtered_texts.append(processed_text)
                    filtered_emotions.append(emotion)
        
        print(f"✅ Filtered dataset: {len(filtered_texts)} samples")
        
        # Show sample data
        print("\n📋 Sample data:")
        for i in range(min(3, len(filtered_texts))):
            print(f"  Text: {filtered_texts[i][:50]}...")
            print(f"  Emotion: {filtered_emotions[i]}")
            print()
        
        return filtered_texts, filtered_emotions

    def load_multiple_emotion_datasets(self, dataset_configs):
        """Load dan combine multiple emotion datasets"""
        all_texts = []
        all_emotions = []
        
        for config in dataset_configs:
            try:
                print(f"\n🔄 Processing: {config['path']}")
                
                has_header = config.get('has_header', True)
                texts, emotions = self.load_emotion_dataset(
                    config['path'],
                    config.get('text_column'),
                    config.get('emotion_column'),
                    has_header=has_header
                )
                
                # Standardize emotions
                standardized_emotions = self.standardize_emotion_labels(emotions)
                
                all_texts.extend(texts)
                all_emotions.extend(standardized_emotions)
                
                print(f"✅ Added {len(texts)} samples from {config['path']}")
                
            except Exception as e:
                print(f"❌ Error loading {config['path']}: {e}")
                continue
        
        if len(all_texts) == 0:
            raise ValueError("No valid data loaded from any dataset")
        
        print(f"\n🎯 Total combined dataset: {len(all_texts)} samples")
        
        # Show final emotion distribution (fix sorting issue)
        unique_emotions = list(set(all_emotions))
        print("\n📊 Final emotion distribution:")
        for emotion in unique_emotions:  # Remove sorted() to avoid type error
            count = all_emotions.count(emotion)
            print(f"  {emotion}: {count} ({count/len(all_emotions)*100:.1f}%)")
        
        return all_texts, all_emotions

    def preprocess_text(self, text):
        """Preprocessing untuk teks dengan fallback untuk Sastrawi"""
        if not text or len(str(text).strip()) == 0:
            return ""
        
        text = str(text).lower()
        
        # Remove mentions, hashtags, URLs
        text = re.sub(r'@\w+|#\w+|http\S+|www\S+', '', text)
        
        # Remove special characters but keep Indonesian characters 
        text = re.sub(r'[^a-zA-Z\s\u00C0-\u017F]', '', text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Indonesian preprocessing if available
        if self.stopword_remover_id and self.stemmer_id:
            try:
                text = self.stopword_remover_id.remove(text)
                text = self.stemmer_id.stem(text)
            except Exception as e:
                print(f"⚠️  Sastrawi processing failed: {e}")
        
        return text

    def prepare_sequences(self, texts, emotions):
        """Convert text to sequences"""
        print("\n🔄 Preparing sequences...")
        
        self.tokenizer = Tokenizer(num_words=self.vocab_size, oov_token='<OOV>')
        self.tokenizer.fit_on_texts(texts)
        
        sequences = self.tokenizer.texts_to_sequences(texts)
        padded_sequences = pad_sequences(sequences, maxlen=self.max_length, padding='post')
        
        self.label_encoder = LabelEncoder()
        encoded_emotions = self.label_encoder.fit_transform(emotions)
        
        print(f"📊 Vocabulary size: {len(self.tokenizer.word_index)}")
        print(f"📊 Sequence shape: {padded_sequences.shape}")
        print(f"📊 Emotion classes: {self.label_encoder.classes_}")
        
        return padded_sequences, encoded_emotions

    def build_model(self, num_classes):
        """Build enhanced TensorFlow model"""
        print("\n🏗️  Building model...")
        
        self.model = Sequential([
            Embedding(self.vocab_size, 128, input_length=self.max_length),
            Bidirectional(LSTM(64, dropout=0.3, recurrent_dropout=0.3, return_sequences=True)),
            Bidirectional(LSTM(32, dropout=0.3, recurrent_dropout=0.3)),
            Dense(64, activation='relu'),
            Dropout(0.5),
            Dense(32, activation='relu'),
            Dropout(0.3),
            Dense(num_classes, activation='softmax')
        ])
        
        self.model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        print(self.model.summary())
        return self.model

    def train(self, dataset_configs, epochs=25, batch_size=64):
        """Train model dengan multiple datasets"""
        print("🚀 Starting training process...")
        print(f"📝 Dataset configs: {len(dataset_configs)} datasets")
        
        # Load multiple datasets
        texts, emotions = self.load_multiple_emotion_datasets(dataset_configs)
        
        if len(texts) == 0:
            raise ValueError("No data loaded. Please check your dataset paths.")
        
        # Prepare sequences
        X, y = self.prepare_sequences(texts, emotions)
        
        # Split data
        print("\n📊 Splitting data...")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print(f"📊 Training samples: {len(X_train)}")
        print(f"📊 Test samples: {len(X_test)}")
        
        # Build model
        num_classes = len(np.unique(y))
        self.build_model(num_classes)
        
        # Callbacks
        early_stopping = tf.keras.callbacks.EarlyStopping(
            monitor='val_loss', patience=3, restore_best_weights=True
        )
        
        reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss', factor=0.2, patience=2, min_lr=0.0001
        )
        
        model_checkpoint = tf.keras.callbacks.ModelCheckpoint(
            'best_model.h5', monitor='val_accuracy', save_best_only=True
        )
        
        # Train
        print("\n🎯 Training model...")
        history = self.model.fit(
            X_train, y_train,
            epochs=epochs,
            batch_size=batch_size,
            validation_data=(X_test, y_test),
            callbacks=[early_stopping, reduce_lr, model_checkpoint],
            verbose=1
        )
        
        # Final evaluation
        test_loss, test_accuracy = self.model.evaluate(X_test, y_test, verbose=0)
        print(f"\n✅ Final Test Accuracy: {test_accuracy:.4f}")
        
        return history

    def save_model(self, model_path='model/emotion_model'):
        """Save emotion model"""
        os.makedirs(os.path.dirname(model_path) if os.path.dirname(model_path) else '.', exist_ok=True)
        
        self.model.save(f'{model_path}_tf')
        
        with open(f'{model_path}_tokenizer.pkl', 'wb') as f:
            pickle.dump(self.tokenizer, f)
        
        with open(f'{model_path}_label_encoder.pkl', 'wb') as f:
            pickle.dump(self.label_encoder, f)
        
        config = {
            'max_length': self.max_length,
            'vocab_size': self.vocab_size,
            'classes': self.label_encoder.classes_.tolist()
        }
        
        with open(f'{model_path}_config.pkl', 'wb') as f:
            pickle.dump(config, f)
        
        print(f"💾 Emotion model saved to {model_path}")

    def predict_emotion(self, text):
        """Predict emotion for a single text"""
        if not self.model or not self.tokenizer or not self.label_encoder:
            raise ValueError("Model not trained or loaded. Please train or load a model first.")
        
        # Preprocess text
        processed_text = self.preprocess_text(text)
        
        # Convert to sequence
        sequence = self.tokenizer.texts_to_sequences([processed_text])
        padded_sequence = pad_sequences(sequence, maxlen=self.max_length, padding='post')
        
        # Predict
        prediction = self.model.predict(padded_sequence, verbose=0)
        predicted_class = np.argmax(prediction[0])
        confidence = prediction[0][predicted_class]
        
        # Get emotion label
        emotion_label = self.label_encoder.inverse_transform([predicted_class])[0]
        
        return {
            'emotion': emotion_label,
            'confidence': float(confidence),
            'all_probabilities': {
                self.label_encoder.inverse_transform([i])[0]: float(prediction[0][i]) 
                for i in range(len(prediction[0]))
            }
        }

    def load_model(self, model_path='model/emotion_detection_model'):
        """Load trained model and associated components"""
        try:
            # Load the TensorFlow model
            self.model = tf.keras.models.load_model(f'{model_path}_tf')
            
            # Load tokenizer
            with open(f'{model_path}_tokenizer.pkl', 'rb') as f:
                self.tokenizer = pickle.load(f)
            
            # Load label encoder
            with open(f'{model_path}_label_encoder.pkl', 'rb') as f:
                self.label_encoder = pickle.load(f)
            
            # Load config
            with open(f'{model_path}_config.pkl', 'rb') as f:
                config = pickle.load(f)
                self.max_length = config['max_length']
                self.vocab_size = config['vocab_size']
            
            print("✅ Model loaded successfully!")
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            self.model = None
            self.tokenizer = None
            self.label_encoder = None
            raise ValueError("Failed to load model. Please check the model files.")

# Training script
if __name__ == "__main__":
    emotion_model = EmotionDetectionModel()
    
    # Dataset configuration - Updated untuk format yang benar
    dataset_configs = [
        {
            'path': 'data/data_indo.csv',
            'has_header': True,  # Dataset Indonesia dengan header, format: text,label
            'text_column': 'text',
            'emotion_column': 'label'
        },
        {
            'path': 'data/test_inggris.csv', 
            'has_header': True,  # Dataset Inggris dengan header, format: text,label
            'text_column': 'text',
            'emotion_column': 'label'
        }
    ]
    
    try:
        # Train
        history = emotion_model.train(dataset_configs, epochs=25, batch_size=64)
        
        # Save
        emotion_model.save_model('model/emotion_detection_model')
        
        print("🎉 Training completed successfully!")
        
        # Test prediction
        test_text = "saya merasa sangat senang hari ini"
        result = emotion_model.predict_emotion(test_text)
        print(f"\n🧪 Test prediction:")
        print(f"Text: {test_text}")
        print(f"Emotion: {result['emotion']}")
        print(f"Confidence: {result['confidence']:.4f}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()