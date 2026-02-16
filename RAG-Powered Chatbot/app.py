import streamlit as st
import requests
import json

st.set_page_config(page_title="RAG Chatbot", page_icon="🤖")

st.title("📚 RAG-Powered Chatbot")
st.markdown("Ask questions about your company documents")

# Initialize session state
if 'messages' not in st.session_state:
    st.session_state.messages = []
if 'session_id' not in st.session_state:
    import uuid
    st.session_state.session_id = str(uuid.uuid4())

# Display chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Chat input
if question := st.chat_input("Ask a question about your documents..."):
    # Add user message
    st.session_state.messages.append({"role": "user", "content": question})
    with st.chat_message("user"):
        st.markdown(question)
    
    # Call backend API
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            try:
                response = requests.post(
                    "https://qo6m1yo6q0.execute-api.ap-southeast-2.amazonaws.com/prod/query",
                    json={
                        "question": question,
                        "session_id": st.session_state.session_id
                    },
                    timeout=30
                )
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Display answer
                    st.markdown(result['answer'])
                    
                    # Display sources
                    if result.get('sources'):
                        with st.expander("📚 Sources"):
                            for i, source in enumerate(result['sources']):
                                st.markdown(f"**Source {i+1}**: {source.get('source', 'Unknown')}")
                                if source.get('page'):
                                    st.caption(f"Page: {source['page']}")
                    
                    # Add to history
                    st.session_state.messages.append({
                        "role": "assistant", 
                        "content": result['answer']
                    })
                else:
                    st.error(f"Error {response.status_code}: {response.text}")
                    
            except Exception as e:
                st.error(f"Error: {str(e)}")