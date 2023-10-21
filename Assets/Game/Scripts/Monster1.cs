using UnityEngine;

public class Monster1 : MonoBehaviour
{
    public float moveDistance = 5f; 
    public float speed = 5f; 
    public float delayAfterTeleport = 2f; 

    private Vector3 initialPosition;
    private float distanceMoved = 0f;
    private bool shouldMove = false;

    //Variáveis Áudio:
    [SerializeField] private float limitVoice = 8f;
    private float timerVoice = 0f;
    private int typeVoice = 1;

    //Compopnentes:
    private AudioSource audioSource;

    //Lista de SFX:
    [SerializeField] private AudioClip sfxVoice1;
    [SerializeField] private AudioClip sfxVoice2;

    void Start()
    {
        initialPosition = transform.position;
        Invoke("StartMoving", delayAfterTeleport);
        audioSource = GetComponent<AudioSource>();
    }

    void Update()
    {
        if (shouldMove)
        {
            Vector3 newPosition = transform.position + Vector3.left * speed * Time.deltaTime;
            transform.position = newPosition;
            distanceMoved += Mathf.Abs(speed * Time.deltaTime);

            if (distanceMoved >= moveDistance)
            {
                transform.position = initialPosition;
                distanceMoved = 0f;
                shouldMove = false;
                Invoke("StartMoving", delayAfterTeleport);
            }
        }

        //SFX Grunindos:
        timerVoice = timerVoice + Time.deltaTime;
        if (timerVoice > limitVoice)
        {
            switch (typeVoice)
            {
                case 1:
                    audioSource.PlayOneShot(sfxVoice1);
                    typeVoice = 2;
                    timerVoice = 0f;
                    break;

                case 2:
                    audioSource.PlayOneShot(sfxVoice2);
                    typeVoice = 1;
                    timerVoice = 0f;
                    break;
            }
        }
    }

    void StartMoving()
    {
        shouldMove = true;
    }
}
